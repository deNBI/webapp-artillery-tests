exports.Util = class Util {
  static RSTUDIO = 'rstudio';

  static RESENV_URL = 'artilleryResEnv';

  static by_data_test_id_str(dataTestId) {
    return `[data-test-id="${dataTestId}"]`;
  }

  static by_data_test_id_str_prefix(dataTestId) {
    return `[data-test-id ^=${dataTestId}]`;
  }

  static by_data_test_id_str_suffix(dataTestId) {
    return `[data-test-id $=${dataTestId}]`;
  }
};
