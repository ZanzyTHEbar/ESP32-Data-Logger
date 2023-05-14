
use log::{ error, info};
use reqwest::Client;
//use serde_json::{Map, Value};
//use std::io::Read;

/// A struct to hold the REST client
/// ## Fields
/// - `client`: a reqwest client
/// - `base_url`: the base url of the api to query
/// - `name`: the name of the url to query
/// - `data`: a hashmap of the data returned from the api
pub struct RESTClient {
  http_client: Client,
  base_url: String,
  method: String,
}

/// A function to create a new RESTClient instance
/// ## Arguments
/// - `base_url` The base url of the api to query
impl RESTClient {
  pub fn new(base_url: String, method: String) -> Self {
    Self {
      http_client: Client::new(),
      base_url,
      method,
    }
  }
}

pub async fn request(rest_client: &RESTClient) -> Result<String, String> {
  info!("Making REST request");
  let response: String;
  let response = match rest_client.method.as_str() {
    "GET" => {
      response = rest_client
        .http_client
        .get(&rest_client.base_url)
        .header("User-Agent", "EyeTrackVR")
        .send()
        .await
        .map_err(|e| e.to_string())?
        .text()
        .await
        .map_err(|e| e.to_string())?;
      response
    }
    "POST" => {
      response = rest_client
        .http_client
        .post(&rest_client.base_url)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .text()
        .await
        .map_err(|e| e.to_string())?;
      response
    }
    _ => {
      error!("Invalid method");
      return Err("Invalid method".to_string());
    }
  };

  Ok(response)
}

/// A function to run a REST Client and create a new RESTClient instance for each device found
/// ## Arguments
/// - `endpoint` The endpoint to query for
/// - `device_name` The name of the device to query
pub async fn run_rest_client(
  endpoint: String,
  device_name: String,
  method: String,
) -> Result<String, String> {
  info!("Starting REST client");
  let full_url = format!("{}{}", device_name, endpoint);
  let mut request_response: String = String::new();
  //info!("Full url: {}", full_url);
  let rest_client = RESTClient::new(full_url, method);
  let request_result = request(&rest_client).await;
  match request_result {
    Ok(response) => {
      request_response = response;
      println!("[REST Client]: Request response: {:?}", request_response);
    }
    Err(e) => println!("[REST Client]: Request failed: {}", e),
  }
  Ok(request_response)
}
