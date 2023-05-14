#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[cfg(target_os = "linux")]
use std::fs::metadata;
#[cfg(target_os = "linux")]
use std::path::PathBuf;

// TODO: setup building for linux and macOS

use tauri::Manager;
use tauri::{
  CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem, WindowEvent,
};

// Various imports
use serde::{Deserialize, Serialize};

// use custom modules
mod modules;
use modules::tauri_commands;

#[derive(Clone, Serialize)]
struct SingleInstancePayload {
  args: Vec<String>,
  cwd: String,
}

#[derive(Clone, Serialize)]
struct SystemTrayPayload {
  message: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct Config {
  names: Vec<String>,
  urls: Vec<String>,
}

fn main() {
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  let hide = CustomMenuItem::new("hide".to_string(), "Hide");
  let show = CustomMenuItem::new("show".to_string(), "Show");

  let tray_menu = SystemTrayMenu::new()
    .add_item(quit)
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(hide)
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(show);

  let tray = SystemTray::new().with_menu(tray_menu);

  tauri::Builder::default()
    //Note: This is a workaround for a bug in tauri that causes the window to not resize properly inducing a noticeable lag
    // ! https://github.com/tauri-apps/tauri/issues/6322#issuecomment-1448141495
    .on_window_event(|e| {
      if let WindowEvent::Resized(_) = e.event() {
        std::thread::sleep(std::time::Duration::from_nanos(1));
      }
    })
    .invoke_handler(tauri::generate_handler![
      tauri_commands::close_splashscreen,
      tauri_commands::run_mdns_query,
      tauri_commands::get_user,
      tauri_commands::do_rest_request,
      tauri_commands::handle_save_window_state,
      tauri_commands::handle_load_window_state,
    ])
    .plugin(tauri_plugin_single_instance::init(|app, args, cwd| {
      app
        .emit_all("new-instance", Some(SingleInstancePayload { args, cwd }))
        .unwrap_or_else(|e| {
          eprintln!("Failed to emit new-instance event: {}", e);
        });
    }))
    .plugin(tauri_plugin_store::Builder::default().build())
    // save window position and size between sessions
    .plugin(tauri_plugin_window_state::Builder::default().build())
    .setup(move |app| {
      let window = app
        .get_window("main")
        .unwrap_or_else(|| panic!("Failed to get window {}", "main"));
      //set_shadow(&window, true).expect("Unsupported platform!");
      window.hide().unwrap();
      let app_handle = app.handle();
      app_handle
        .plugin(
          tauri_plugin_log::Builder::default()
            .targets([
              tauri_plugin_log::LogTarget::LogDir,
              tauri_plugin_log::LogTarget::Stdout,
              tauri_plugin_log::LogTarget::Webview,
            ])
            .filter(|metadata| metadata.target() != "polling::iocp")
            .level(tauri_commands::handle_debug(app_handle.clone()).unwrap())
            .build(),
        )
        .expect("Failed to initialize logger");
      Ok(())
    })
    .system_tray(tray)
    .on_system_tray_event(move |app, event| match event {
      SystemTrayEvent::LeftClick {
        position: _,
        size: _,
        ..
      } => {
        dbg!("system tray received a left click");
        let window = app.get_window("main").unwrap();
        window.show().unwrap();
        /* let logical_size = tauri::LogicalSize::<f64> {
            width: 300.0,
            height: 400.0,
        };
        let logical_s = tauri::Size::Logical(logical_size);
        window.set_size(logical_s); */
      }
      SystemTrayEvent::RightClick {
        position: _,
        size: _,
        ..
      } => {
        dbg!("system tray received a right click");
      }
      SystemTrayEvent::DoubleClick {
        position: _,
        size: _,
        ..
      } => {
        dbg!("system tray received a double click");
      }
      SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
        "quit" => {
          std::process::exit(0);
        }
        "hide" => {
          let window = app.get_window("main").unwrap();
          window.hide().unwrap();
        }
        "show" => {
          let window = app.get_window("main").unwrap();
          window.show().unwrap();
        }
        _ => {}
      },
      _ => {}
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
