export default function localStorageHandler(settings_key: string, key: string, value: unknown) {
  // check if local storage is available
  const temp = {
    [key]: value,
  }
  if (typeof Storage !== 'undefined') {
    // check if localstorage is empty
    if (localStorage.getItem(settings_key) === null) {
      // if empty, set localstorage to settings
      localStorage.setItem(settings_key, JSON.stringify(temp))
    } else {
      // if not empty, check if settings are the same
      if (localStorage.getItem(settings_key) !== JSON.stringify(temp)) {
        // if not the same, change only the settings that are different
        // check if localSettings is null
        const localSettings: string = localStorage.getItem(settings_key) || ''
        const localSettingsParsed = JSON.parse(localSettings)
        localSettingsParsed[key] = value
        localStorage.setItem(settings_key, JSON.stringify(localSettingsParsed))
      } else {
        return
      }
    }
  }
}
