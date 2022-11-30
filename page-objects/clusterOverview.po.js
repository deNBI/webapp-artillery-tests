const { expect } = require('@playwright/test');
const { Util } = require('./util.po');

exports.ClusterOverviewPage = class ClusterOverviewPage {
  // STATUS
  RUNNING_STATUS_PREFIX = 'running_';

  DELETED_STATUS_PREFIX = 'deleted_';

  // ACTIONS
  SHOW_DELETE_CLUSTER_PREFIX = 'delete_cluster_';

  VERIFY_DELETE_BUTTON = 'verifyDeleteButton';

  constructor(page, baseURL) {
    this.page = page;
    this.baseURL = baseURL;
  }

  async goto() {
    if (this.page.url() !== `${this.baseURL}/#/virtualmachines/clusterOverview`) {
      await this.page.goto(`${this.baseURL}/#/virtualmachines/clusterOverview`);
      await this.page.waitForNavigation({ url: '**/clusterOverview' });
    }
  }

  async waitForClusterToBeRunning(clusterId, timeout = 10000) {
    const runningElement = await this.page.waitForSelector(
      Util.by_data_test_id_str(`${this.RUNNING_STATUS_PREFIX}${clusterId}`),
      {
        state: 'visible',
        timeout,
      },
    );

    return runningElement.isVisible();
  }

  async waitForClusterToBeDeleted(clusterId, timeout = 10000) {
    const deletedElement = await this.page.waitForSelector(
      Util.by_data_test_id_str(`${this.DELETED_STATUS_PREFIX}${clusterId}`),
      {
        state: 'visible',
        timeout,
      },
    );

    return deletedElement.isVisible();
  }

  async deleteCluster(clusterId) {
    const locatorDelete = this.page.locator(Util.by_data_test_id_str(`${this.SHOW_DELETE_CLUSTER_PREFIX}${clusterId}`));
    await expect(locatorDelete).toBeVisible();
    await locatorDelete.click();
    await this.page.locator(Util.by_data_test_id_str(this.VERIFY_DELETE_BUTTON)).waitFor({ state: 'visible' });
    await this.page.locator(Util.by_data_test_id_str(this.VERIFY_DELETE_BUTTON)).click();
  }
};
