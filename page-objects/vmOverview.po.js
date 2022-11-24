const { expect } = require('@playwright/test');
const { Util } = require('./util.po');

exports.VmOverviewPage = class VmOverviewPage {
  // STATUS
  ACTIVE_STATUS_PREFIX = 'active_';

  DELETED_STATUS_PREFIX = 'deleted_';

  // ACTIONS
  SHOW_ACTIONS_PREFIX = 'show_actions_button_';

  SHOW_DELETE_VM_PREFIX = 'delete_vm_';

  VERIFY_DELETE_BUTTON = 'verifyDeleteButton';

  constructor(page, baseURL) {
    this.page = page;
    this.baseURL = baseURL;
  }

  async goto() {
    await this.page.goto(`${this.baseURL}/#/virtualmachines/vmOverview`);
    await this.page.waitForNavigation({ url: '**/vmOverview' });
  }

  async waitForInstanceToBeActive(vmName, timeout = 10000) {
    const activeElement = await this.page.waitForSelector(
      Util.by_data_test_id_str_prefix(`${this.ACTIVE_STATUS_PREFIX}${vmName}`),
      {
        state: 'visible',
        timeout,
      },
    );

    return activeElement.isVisible();
  }

  async waitForInstanceToBeDeleted(vmName, timeout = 10000) {
    await this.page.waitForSelector(Util.by_data_test_id_str_prefix(`${this.DELETED_STATUS_PREFIX}${vmName}`), {
      state: 'visible',
      timeout,
    });
  }

  async showActions(vmName) {
    await this.page.locator(Util.by_data_test_id_str_prefix(`${this.SHOW_ACTIONS_PREFIX}${vmName}`)).click();
  }

  async deleteVirtualMachine(vmName, timeout = 10000) {
    await this.showActions(vmName);
    const locatorDelete = this.page.locator(Util.by_data_test_id_str_prefix(`${this.SHOW_DELETE_VM_PREFIX}${vmName}`));
    await expect(locatorDelete).toBeVisible();
    await locatorDelete.click();
    await this.page.locator(Util.by_data_test_id_str(this.VERIFY_DELETE_BUTTON)).isVisible();
    await Util.clickByDataTestIdStr(this.page, this.VERIFY_DELETE_BUTTON);
    await this.waitForInstanceToBeDeleted(vmName, timeout);
  }
};
