#[cfg(target_os = "linux")]
use std::fs::metadata;
#[cfg(target_os = "linux")]
use std::path::PathBuf;

use log::{debug, error, info};
use tauri::{self, Manager};

use tauri_plugin_store::with_store;

use tauri_plugin_window_state::{AppHandleExt, StateFlags, WindowExt};
use whoami::username;

use crate::modules::m_dnsquery;
use crate::modules::rest_client;

/// A command to get the user name from the system
/// ## Returns
/// - `user_name`: String - The user name of the current user
#[tauri::command]
pub async fn get_user() -> Result<String, String> {
  let user_name: String = username();
  info!("User name: {}", user_name);
  Ok(user_name)
}

/// A function to run a mDNS query and write the results to a config file
/// ## Arguments
/// - `service_type` The service type to query for
/// - `scan_time` The number of seconds to query for
#[tauri::command]
pub async fn run_mdns_query(
  service_type: String,
  scan_time: u64,
) -> Result<m_dnsquery::MdnsData, String> {
  info!("Starting MDNS query to find devices");
  let mut mdns: m_dnsquery::Mdns = m_dnsquery::Mdns::new();
  let mut mdns_data = m_dnsquery::MdnsData::new();
  let ref_mdns = &mut mdns;
  info!("MDNS Service Thread acquired lock");
  m_dnsquery::run_query(ref_mdns, service_type, &mut mdns_data, scan_time)
    .await
    .expect("Error in mDNS query");
  info!("MDNS query complete");
  info!(
    "MDNS query results: {:#?}",
    m_dnsquery::get_urls(&*ref_mdns)
  ); // get's an array of the base urls found
  Ok(mdns_data)
}

#[tauri::command]
pub async fn do_rest_request(
  endpoint: String,
  device_name: String,
  method: String,
) -> Result<String, String> {
  info!("Starting REST request");
  let response = rest_client::run_rest_client(endpoint, device_name, method)
    .await
    .expect("Error in REST request");
  Ok(response)
}

///! This command must be async so that it doesn't run on the main thread.
#[tauri::command]
pub async fn close_splashscreen(window: tauri::Window) {
  // Close splashscreen
  if let Some(splashscreen) = window.get_window("splashscreen") {
    splashscreen.close().expect("Failed to close splashscreen");
  }
  // Show main window
  window
    .get_window("main")
    .expect("Failed to get main window")
    .show()
    .unwrap();
}

#[tauri::command]
pub async fn handle_save_window_state<R: tauri::Runtime>(
  app: tauri::AppHandle<R>,
) -> Result<(), String> {
  app
    .save_window_state(StateFlags::all())
    .expect("[Window State]: Failed to save window state");
  Ok(())
}

#[tauri::command]
pub async fn handle_load_window_state<R: tauri::Runtime>(
  window: tauri::Window<R>,
) -> Result<(), String> {
  window
    .restore_state(StateFlags::all())
    .expect("[Window State]: Failed to restore window state");

  Ok(())
}

pub fn handle_debug<R: tauri::Runtime>(
  app: tauri::AppHandle<R>,
) -> Result<log::LevelFilter, String> {
  // read the Store file
  let stores = app.state::<tauri_plugin_store::StoreCollection<R>>();
  let path = std::path::PathBuf::from(".app-settings.bin");
  // match the store value to a LogFilter
  let mut debug_state: String = String::new();
  with_store(app.clone(), stores, path, |store| {
    let settings = store.get("settings");
    debug!("Settings: {:?}", settings);
    if let Some(json) = settings {
      let _serde_json = serde_json::from_value::<serde_json::Value>(json.clone());
      debug!("Serde JSON: {:?}", _serde_json);
      let serde_json_result = match _serde_json {
        Ok(serde_json) => serde_json,
        Err(err) => {
          error!("Error configuring JSON config file: {}", err);
          return Err(tauri_plugin_store::Error::Json(err));
        }
      };
      let temp = &serde_json_result["debugMode"];
      debug!("Debug: {:?}", temp);
      debug_state = serde_json::from_value::<String>(temp.clone()).unwrap();
    } else {
      debug_state = serde_json::json!({}).to_string();
    }
    info!("Debug state: {}", debug_state);
    Ok(())
  })
  .expect("Failed to get store");
  // set the log level
  let log_level = match debug_state.as_str() {
    "off" => log::LevelFilter::Off,
    "error" => log::LevelFilter::Error,
    "warn" => log::LevelFilter::Warn,
    "info" => log::LevelFilter::Info,
    "debug" => log::LevelFilter::Debug,
    "trace" => log::LevelFilter::Trace,
    _ => log::LevelFilter::Info,
  };
  // return the result
  Ok(log_level)
}
