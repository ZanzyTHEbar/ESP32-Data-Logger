#![allow(dead_code)]
//! A mdns query client.

use log::{error, info};
use mdns_sd::{ServiceDaemon, ServiceEvent};
use serde_json;
use std::collections::hash_map::HashMap;
use std::sync::{Arc, Mutex};

pub type MdnsMap = Arc<Mutex<HashMap<String, String>>>; // Arc<Mutex<HashMap<String, String>>>;
/// A struct to hold the mDNS query results
/// - `base_url`: a hashmap of the base urls found
/// - `name`: a vector of the names of the devices found
#[derive(Debug)]
pub struct Mdns {
    pub base_url: MdnsMap,
    pub names: Vec<String>,
}
/// Runs a mDNS query for X seconds
/// ## Arguments
/// - `mdns` A mutable reference to the Mdns struct
/// - `service_type` The service type to query for
/// - `scan_time` The number of seconds to query for
/// ## Example
/// ```
/// // Create a new Mdns struct
///let mut mdns: m_dnsquery::Mdns = m_dnsquery::Mdns {
///    base_url: HashMap::new(),
///    name: Vec::new(),
///};
/// // Run a mDNS query for 10 seconds
///let ref_mdns = &mut mdns;
///m_dnsquery::run_query(ref_mdns, String::from("_http._tcp"), 10);
/// ```
/// ## Notes
/// ***The service type should not have a '.' or a 'local' at the end.*** <br>
/// ***The program adds ".local." automatically.***
pub async fn run_query(
    instance: &mut Mdns,
    mut service_type: String,
    scan_time: u64,
) -> Result<(), Box<dyn std::error::Error>> {
    let mdns = ServiceDaemon::new()
        .expect("Failed to create daemon. Please install Bonjour on your system");
    //* Browse for a service type.
    service_type.push_str(".local.");
    let receiver = mdns
        .browse(&service_type)
        .expect("Failed to browse. Please install Bonjour on your system.");
    let now = std::time::Instant::now();
    //* listen for event then stop the event loop after 5 seconds.
    // while let Ok(event) = receiver.recv() {}
    while now.elapsed().as_secs() < scan_time {
        //* let event = receiver.recv().expect("Failed to receive event");
        if let Ok(event) = receiver.recv_async().await {
            match event {
                ServiceEvent::ServiceResolved(info) => {
                    info!(
                        "At {:?}: Resolved a new service: {} IP: {:#?}:{:#?} Hostname: {:#?}",
                        now.elapsed(),
                        info.get_fullname(),
                        info.get_addresses(),
                        info.get_port(),
                        info.get_hostname(),
                    );
                    //* split the fullname by '.' and take the first element
                    let name = info.get_hostname();
                    info!("Service name: {}", name);
                    //* remove the period at the end of the name
                    let name = name.trim_end_matches('.');
                    //* append name to 'http://' to get the base url
                    let mut base_url = String::from("http://");
                    base_url.push_str(name);
                    info!("Base URL: {}", base_url);
                    //* add the base url to the hashmap
                    instance
                        .base_url
                        .lock()
                        .expect("Failed to lock base_url in run_query")
                        .insert(name.to_string(), base_url);
                    instance.names.push(name.to_string());
                }
                other_event => {
                    info!(
                        "At {:?} : Received other event: {:?}",
                        now.elapsed(),
                        &other_event
                    );
                }
            }
        }
    }
    Ok(())
}
/// Returns a map of the base urls found
/// ## Arguments
/// - `mdns` A mutable reference to the Mdns struct
/// ## Return
/// A map of all the base urls found for the service type
/// ## Example
/// ```
/// // Create a new Mdns struct
///let mut mdns: m_dnsquery::Mdns = m_dnsquery::Mdns {
///    base_url: HashMap::new(),
///    name: Vec::new(),
///};
/// // Run a query for 10 seconds
///let ref_mdns = &mut mdns;
///m_dnsquery::run_query(ref_mdns, String::from("_http._tcp"), 10);
/// // Get the base urls map
///let urls_map = m_dnsquery::get_url_map(ref_mdns);
/// ```
pub fn get_url_map(instance: &mut Mdns) -> &mut MdnsMap {
    &mut instance.base_url
}
/// Returns a vector of the base urls found
/// ## Arguments
/// - `mdns` A mutable reference to the Mdns struct
/// ## Return
/// A vector of all the urls found for the service type
/// ## Example
/// ```
/// // Create a new Mdns struct
/// let mut mdns: m_dnsquery::Mdns = m_dnsquery::Mdns {
///    base_url: HashMap::new(),
///   name: Vec::new(),
/// };
/// // Run a query for 10 seconds
/// let ref_mdns = &mut mdns;
/// m_dnsquery::run_query(ref_mdns, String::from("_http._tcp"), 10);
/// // Get the names vector
/// let vec = m_dnsquery::get_urls(ref_mdns);
/// ```
pub fn get_urls(instance: &Mdns) -> Vec<String> {
    let mut urls: Vec<String> = Vec::new();

    let instance_lock = instance.base_url.lock();
    let instance_check_result = match instance_lock {
        Ok(instance_lock) => instance_lock,
        Err(err) => {
            error!(
                "Failed to lock the instance: {:?} with error: {} in get_urls",
                instance, err
            );
            return urls;
        }
    };

    for (_, url) in instance_check_result.iter() {
        urls.push(url.to_string());
    }
    urls
}
pub async fn generate_json(instance: &Mdns) -> Result<(), Box<dyn std::error::Error>> {
    let data = get_urls(instance);
    //let mut json: serde_json::Value = serde_json::from_str("{}").unwrap();
    let mut json: Option<serde_json::Value> = None;
    // create a data iterator
    for (i, url) in data.iter().enumerate() {
        json = Some(serde_json::json!({
            "names": [instance.names[i].to_string()],
            "urls": {
                instance.names[i].to_string(): url.to_string()
            },
        }));
    }
    let config: serde_json::Value;
    if let Some(json) = json {
        let _serde_json = serde_json::from_value(json);
        let serde_json_result = match _serde_json {
            Ok(serde_json) => serde_json,
            Err(err) => {
                error!("Error configuring JSON config file: {}", err);
                return Err("Error configuring JSON config file".into());
            }
        };
        config = serde_json_result;
    } else {
        config = serde_json::json!({});
    }
    info!("{:?}", config);
    // write the json object to a file
    let to_string_json = serde_json::to_string_pretty(&config)?;
    tokio::fs::write("config/config.json", to_string_json).await?;
    Ok(())
}
