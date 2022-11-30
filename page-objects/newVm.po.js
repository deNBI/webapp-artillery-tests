const { Util } = require('./util.po');

exports.NewVmPage = class NewVmPage {
  PROJECT_SELECTION_DROPDOWN = 'project_selection_dropdown';

  INSTANCE_NAME_INPUT_FIELD = 'instance_name_input_field';

  FLAVOR_SELECTION_PREFIX = 'flavor_';

  IMAGE_SELECTION_PREFIX = 'image_';

  FLAVOR_IMAGE_SELECTED_SUFFIX = '_selected';

  NORMAL_FLAVOR_TO_SELECT = 'de_NBI_tiny';

  NORMAL_IMAGE_TO_SELECT = 'Ubuntu_18_04_LTS_de_NBI';

  ADD_NEW_VOLUME_TAB = 'add_new_volume_tab';

  NEW_VOLUME_NAME_INPUT = 'new_volume_name_input';

  NEW_VOLUME_MOUNT_PATH_INPUT = 'new_volume_mount_path_input';

  NEW_VOLUME_STORAGE_INPUT = 'new_volume_storage_input';

  NEW_VOLUME_CONFIRMATION_BUTTON = 'add_volume_confirmation_button';

  VM_RESPONSIBILITY_CHECKBOX = 'vm_responsibility_input';

  START_VM_BUTTON = 'start_vm_button';

  RESENV_TEMPLATE_PREFIX = 'add_resenv_template_';

  RESENV_URL_INPUT = 'resenv_url_input';

  ANSIBLE_NEED_OKAY = 'ansible_need_okay';

  RESENV_ACCORDION_HEADING = 'resenv_accordion_heading';

  SITE_LOADER = 'site-loader';

  REDIRECTING_INSTANCE_OVERVIEW = 'redirecting_instance_overview';

  NEW_VM_NAME = 'new_vm_name';

  IMAGE_SECTION = 'image_section';

  constructor(page, baseURL) {
    this.page = page;
    this.baseURL = baseURL;
  }

  async goto() {
    await this.page.goto(`${this.baseURL}/#/virtualmachines/newVM`);
    await this.page.waitForNavigation({ url: '**/newVM', timeout: 10 * Util.MINUTE });
    await this.page.locator('text=New Virtual Machine').waitFor({ timeout: 15 * Util.MINUTE });
  }

  async selectProject(applicationName) {
    await this.page.waitForSelector(Util.by_data_test_id_str(this.SITE_LOADER), { state: 'hidden', timeout: 10 * Util.MINUTE });
    const dropdown = await this.page.locator(
      Util.by_data_test_id_str(this.PROJECT_SELECTION_DROPDOWN),
    ).isVisible();
    if (dropdown) {
      await this.page.selectOption(Util.by_data_test_id_str(this.PROJECT_SELECTION_DROPDOWN), {
        label: applicationName,
      });
    }
    await this.page.locator(Util.by_data_test_id_str(this.INSTANCE_NAME_INPUT_FIELD)).waitFor({ state: 'visible', timeout: 10 * Util.MINUTE });
  }

  async startNormalVM(
    applicationName,
    vmName,
    withVolume = false,
    withResenv = false,
  ) {
    await this.page.fill(Util.by_data_test_id_str(this.INSTANCE_NAME_INPUT_FIELD), vmName);
    await this.page.locator(Util.by_data_test_id_str(this.FLAVOR_SELECTION_PREFIX + this.NORMAL_FLAVOR_TO_SELECT)).first().waitFor({ state: 'visible', timeout: 10 * Util.MINUTE });
    await this.page.locator(Util.by_data_test_id_str(this.FLAVOR_SELECTION_PREFIX + this.NORMAL_FLAVOR_TO_SELECT)).click();
    await this.page
      .locator(
        Util.by_data_test_id_str(
          this.FLAVOR_SELECTION_PREFIX + this.NORMAL_FLAVOR_TO_SELECT + this.FLAVOR_IMAGE_SELECTED_SUFFIX,
        ),
      )
      .waitFor({ state: 'visible' });
    await this.page.locator(Util.by_data_test_id_str_prefix(this.IMAGE_SELECTION_PREFIX + this.NORMAL_IMAGE_TO_SELECT)).first().waitFor({ state: 'visible', timeout: 10 * Util.MINUTE });
    await this.page.locator(Util.by_data_test_id_str_prefix(this.IMAGE_SELECTION_PREFIX + this.NORMAL_IMAGE_TO_SELECT)).first().click();
    const imagesSectionAfter = this.page.locator(Util.by_data_test_id_str(this.IMAGE_SECTION));
    const selectedImage = imagesSectionAfter.locator(Util.by_data_test_id_str_suffix(this.FLAVOR_IMAGE_SELECTED_SUFFIX));
    await selectedImage
      .locator(
        Util.by_data_test_id_str_prefix(
          this.NORMAL_IMAGE_TO_SELECT,
        ),
      )
      .waitFor({ state: 'visible' });
    if (withVolume) {
      await this.page.locator(Util.by_data_test_id_str(this.ADD_NEW_VOLUME_TAB)).click();
      await this.page.fill(Util.by_data_test_id_str(this.NEW_VOLUME_NAME_INPUT), `volume_${applicationName}`);
      await this.page.fill(Util.by_data_test_id_str(this.NEW_VOLUME_MOUNT_PATH_INPUT), 'test');
      await this.page.fill(Util.by_data_test_id_str(this.NEW_VOLUME_STORAGE_INPUT), '1');
      await this.page.locator(Util.by_data_test_id_str(this.NEW_VOLUME_CONFIRMATION_BUTTON)).click();
    }
    if (withResenv) {
      await this.page.locator(Util.by_data_test_id_str(this.RESENV_ACCORDION_HEADING)).click();
      await this.page.locator(Util.by_data_test_id_str(this.RESENV_TEMPLATE_PREFIX + Util.RSTUDIO)).click();
      await this.page.fill(Util.by_data_test_id_str(this.RESENV_URL_INPUT), Util.RESENV_URL);
      await this.page.locator(Util.by_data_test_id_str(this.ANSIBLE_NEED_OKAY)).click();
    }
    await this.page.locator(Util.by_data_test_id_str(this.VM_RESPONSIBILITY_CHECKBOX)).click();
    await this.page.locator(Util.by_data_test_id_str(this.START_VM_BUTTON)).click();
    await this.page.waitForSelector(Util.by_data_test_id_str(this.REDIRECTING_INSTANCE_OVERVIEW), {
      state: 'visible',
    });
    const fullVmName = await this.page.locator(Util.by_data_test_id_str(this.NEW_VM_NAME)).innerText();
    await this.page.waitForNavigation({ url: '**/vmOverview', timeout: 10 * Util.MINUTE });
    return fullVmName;
  }
};
