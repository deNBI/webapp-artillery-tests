const { Util } = require('./util.po');

exports.NewVmPage = class NewVmPage {
  PROJECT_SELECTION_DROPDOWN = 'project_selection_dropdown';

  INSTANCE_NAME_INPUT_FIELD = 'instance_name_input_field';

  FLAVOR_SELECTION_PREFIX = 'flavor_';

  IMAGE_SELECTION_PREFIX = 'image_';

  FLAVOR_IMAGE_SELECTED_SUFFIX = '_selected';

  NORMAL_FLAVOR_TO_SELECT = 'de_NBI_tiny';

  NORMAL_IMAGE_TO_SELECT = 'Ubuntu_18_04_LTS_de_NBI__2022-10-28_';

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

  constructor(page, baseURL) {
    this.page = page;
    this.baseURL = baseURL;
  }

  async goto() {
    await this.page.goto(`${this.baseURL}/#/virtualmachines/newVM`);
    await this.page.waitForNavigation({ url: '**/newVM' });
    await this.page.locator('text=New Virtual Machine').waitFor();
  }

  async selectProject(applicationName) {
    await this.page.waitForSelector(Util.by_data_test_id_str(this.SITE_LOADER), { state: 'hidden' });
    const dropdown = await this.page.locator(
      Util.by_data_test_id_str(this.PROJECT_SELECTION_DROPDOWN),
    ).isVisible();
    if (dropdown) {
      await this.page.selectOption(Util.by_data_test_id_str(this.PROJECT_SELECTION_DROPDOWN), {
        label: applicationName,
      });
      await this.page.locator(Util.by_data_test_id_str(this.INSTANCE_NAME_INPUT_FIELD)).isVisible();
    } else {
      await this.page.locator(Util.by_data_test_id_str(this.INSTANCE_NAME_INPUT_FIELD)).isVisible();
    }
  }

  async startNormalVM(
    applicationName,
    vmName,
    withVolume = false,
    withResenv = false,
  ) {
    await this.page.fill(Util.by_data_test_id_str(this.INSTANCE_NAME_INPUT_FIELD), vmName);
    await Util.clickByDataTestIdStr(this.page, this.FLAVOR_SELECTION_PREFIX + this.NORMAL_FLAVOR_TO_SELECT);
    await this.page
      .locator(
        Util.by_data_test_id_str(
          this.FLAVOR_SELECTION_PREFIX + this.NORMAL_FLAVOR_TO_SELECT + this.FLAVOR_IMAGE_SELECTED_SUFFIX,
        ),
      )
      .isVisible();
    await Util.clickByDataTestIdStr(this.page, this.IMAGE_SELECTION_PREFIX + this.NORMAL_IMAGE_TO_SELECT);
    await this.page
      .locator(
        Util.by_data_test_id_str(
          this.IMAGE_SELECTION_PREFIX + this.NORMAL_IMAGE_TO_SELECT + this.FLAVOR_IMAGE_SELECTED_SUFFIX,
        ),
      )
      .isVisible();
    if (withVolume) {
      await Util.clickByDataTestIdStr(this.page, this.ADD_NEW_VOLUME_TAB);
      await this.page.fill(Util.by_data_test_id_str(this.NEW_VOLUME_NAME_INPUT), `volume_${applicationName}`);
      await this.page.fill(Util.by_data_test_id_str(this.NEW_VOLUME_MOUNT_PATH_INPUT), 'test');
      await this.page.fill(Util.by_data_test_id_str(this.NEW_VOLUME_STORAGE_INPUT), '1');
      await Util.clickByDataTestIdStr(this.page, this.NEW_VOLUME_CONFIRMATION_BUTTON);
    }
    if (withResenv) {
      await Util.clickByDataTestIdStr(this.page, this.RESENV_ACCORDION_HEADING);
      await Util.clickByDataTestIdStr(this.page, `${this.RESENV_TEMPLATE_PREFIX}${Util.RSTUDIO}`);
      await this.page.fill(Util.by_data_test_id_str(this.RESENV_URL_INPUT), Util.RESENV_URL);
      await Util.clickByDataTestIdStr(this.page, this.ANSIBLE_NEED_OKAY);
    }
    await Util.clickByDataTestIdStr(this.page, this.VM_RESPONSIBILITY_CHECKBOX);
    await Util.clickByDataTestIdStr(this.page, this.START_VM_BUTTON);
    await this.page.waitForSelector(Util.by_data_test_id_str(this.REDIRECTING_INSTANCE_OVERVIEW), {
      state: 'visible',
    });
    return this.page.locator(Util.by_data_test_id_str(this.NEW_VM_NAME)).innerText();
  }
};
