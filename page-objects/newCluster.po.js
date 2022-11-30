const { Util } = require('./util.po');

exports.NewClusterPage = class NewClusterPage {
  NEW_CLUSTER_HEADING = 'new-cluster-heading';

  SITE_LOADER = 'site-loader';

  PROJECT_SELECTION_DROPDOWN = 'project_selection_dropdown';

  CLUSTER_NAME_INPUT_FIELD = 'cluster_name_input_field';

  MASTER_FLAVORS_SECTION = 'master_flavors_section';

  MASTER_IMAGES_SECTION = 'master_images_section';

  WORKER_FLAVOR_SECTION = 'worker_flavors_section';

  FLAVOR_SELECTION_PREFIX = 'flavor_';

  IMAGE_SELECTION_PREFIX = 'image_';

  FLAVOR_IMAGE_SELECTED_SUFFIX = '_selected';

  MASTER_FLAVOR_TO_SELECT = 'de_NBI_tiny';

  WORKER_FLAVOR_TO_SELECT = 'de_NBI_tiny';

  IMAGE_TO_SELECT = 'ubuntu18_04_de_NBI__C__Master';

  WORKER_COUNTER = 'worker_counter';

  CLUSTER_RESPONSIBILITY_CHECKBOX = 'cluster_responsibility_input';

  START_CLUSTER_BUTTON = 'start_cluster_button';

  REDIRECTING_CLUSTER_OVERVIEW = 'redirecting_cluster_overview';

  NEW_CLUSTER_ID = 'new_cluster_id';

  constructor(page, baseURL) {
    this.page = page;
    this.baseURL = baseURL;
  }

  async goto() {
    await this.page.goto(`${this.baseURL}/#/virtualmachines/newCluster`);
    await this.page.waitForNavigation({ url: '**/newCluster', timeout: 20 * Util.MINUTE });
    await this.page.locator(Util.by_data_test_id_str(this.NEW_CLUSTER_HEADING)).waitFor({ timeout: 20 * Util.MINUTE });
  }

  async selectProject(projectName) {
    await this.page.waitForSelector(Util.by_data_test_id_str(this.SITE_LOADER), { state: 'hidden', timeout: 10 * Util.MINUTE });
    const dropdown = await this.page.locator(
      Util.by_data_test_id_str(this.PROJECT_SELECTION_DROPDOWN),
    ).isVisible();
    if (dropdown) {
      await this.page.selectOption(Util.by_data_test_id_str(this.PROJECT_SELECTION_DROPDOWN), {
        label: projectName,
      });
    }
    await this.page.locator(Util.by_data_test_id_str(this.CLUSTER_NAME_INPUT_FIELD)).waitFor({ timeout: 10 * Util.MINUTE });
  }

  async startCluster(clusterName, workers) {
    await this.page.fill(Util.by_data_test_id_str(this.CLUSTER_NAME_INPUT_FIELD), clusterName);
    await this.page.waitForSelector(Util.by_data_test_id_str(this.MASTER_FLAVORS_SECTION), { state: 'visible', timeout: 10 * Util.MINUTE });
    const masterFlavorsSection = this.page.locator(Util.by_data_test_id_str(this.MASTER_FLAVORS_SECTION));
    await masterFlavorsSection.locator(Util.by_data_test_id_str(this.FLAVOR_SELECTION_PREFIX + this.MASTER_FLAVOR_TO_SELECT)).first().click();
    const masterFlavorsSectionAfter = this.page.locator(Util.by_data_test_id_str(this.MASTER_FLAVORS_SECTION));
    await masterFlavorsSectionAfter
      .locator(
        Util.by_data_test_id_str(
          this.FLAVOR_SELECTION_PREFIX + this.MASTER_FLAVOR_TO_SELECT + this.FLAVOR_IMAGE_SELECTED_SUFFIX,
        ),
      )
      .waitFor({ state: 'visible' });
    await this.page.waitForSelector(Util.by_data_test_id_str(this.MASTER_IMAGES_SECTION), { state: 'visible', timeout: 10 * Util.MINUTE });
    const masterImagesSection = this.page.locator(Util.by_data_test_id_str(this.MASTER_IMAGES_SECTION));
    await masterImagesSection.locator(Util.by_data_test_id_str_prefix(this.IMAGE_SELECTION_PREFIX + this.IMAGE_TO_SELECT)).click();
    const masterImagesSectionAfter = this.page.locator(Util.by_data_test_id_str(this.MASTER_IMAGES_SECTION));
    const selectedImage = masterImagesSectionAfter.locator(Util.by_data_test_id_str_suffix(this.FLAVOR_IMAGE_SELECTED_SUFFIX));
    await selectedImage
      .locator(
        Util.by_data_test_id_str_prefix(
          this.IMAGE_TO_SELECT,
        ),
      )
      .waitFor({ state: 'visible' });
    await this.page.waitForSelector(Util.by_data_test_id_str(this.WORKER_FLAVOR_SECTION), { state: 'visible' });
    const workerFlavorSection = this.page.locator(Util.by_data_test_id_str(this.WORKER_FLAVOR_SECTION));
    await workerFlavorSection.locator(Util.by_data_test_id_str(this.FLAVOR_SELECTION_PREFIX + this.WORKER_FLAVOR_TO_SELECT)).click();
    const workerFlavorSectionAfter = this.page.locator(Util.by_data_test_id_str(this.WORKER_FLAVOR_SECTION));
    await workerFlavorSectionAfter
      .locator(
        Util.by_data_test_id_str(
          this.FLAVOR_SELECTION_PREFIX + this.WORKER_FLAVOR_TO_SELECT + this.FLAVOR_IMAGE_SELECTED_SUFFIX,
        ),
      )
      .waitFor({ state: 'visible' });
    await this.page.fill(Util.by_data_test_id_str(this.WORKER_COUNTER), workers);
    await this.page.locator(Util.by_data_test_id_str(this.CLUSTER_RESPONSIBILITY_CHECKBOX)).click();
    await this.page.locator(Util.by_data_test_id_str(this.START_CLUSTER_BUTTON)).click();
    await this.page.waitForSelector(Util.by_data_test_id_str(this.REDIRECTING_CLUSTER_OVERVIEW), {
      state: 'visible',
    });
    const clusterId = await this.page.locator(Util.by_data_test_id_str(this.NEW_CLUSTER_ID)).innerText();
    await this.page.waitForNavigation({ url: '**/clusterOverview', timeout: 10 * Util.MINUTE });
    return clusterId;
  }
};
