exports.LoginPage = class LoginPage {
  TEST_RP_WARNING = 'testRpWarning';

  TEST_RP_CONTINUE = 'Continue';

  constructor(page, baseURL) {
    this.page = page;
    this.baseURL = baseURL;
  }

  async goto() {
    await this.page.goto(`${this.baseURL}/#/`);
  }

  async loginWith(email, psw, type) {
    if (type === 'orcid') {
      await this.withOrcid(email, psw);
    } else if (type === 'hostel') {
      await this.withHostel(email, psw);
    }
  }

  async withOrcid(email, psw) {
    await this.goto();
    await this.page.locator("div[class='idp-box idp-ORCID']").click();
    await this.page.waitForNavigation({ url: 'https://orcid.org/signin**' });
    await this.page.type('id=username', email);
    await this.page.type('id=password', psw);
    await this.page.locator('id=signin-button').click();
    await this.skipElixirTestWarning();
  }

  async withHostel(email, psw) {
    await this.goto();
    await this.page.locator("div[class='idp-box idp-LS username']").click();
    await this.page.waitForNavigation({ url: 'https://hostel.aai.lifescience-ri.eu/lshostel/**' });
    await this.page.type('id=username', email);
    await this.page.type('id=password', psw);
    await this.page.getByRole('button', { name: 'Login' }).click();
    await this.skipElixirTestWarning();
  }

  async skipElixirTestWarning() {
    try {
      await this.page.waitForNavigation({ url: `**/oidc/${this.TEST_RP_WARNING}**` });
      await this.page.locator(`text=${this.TEST_RP_CONTINUE}`).click();
      await this.page.waitForNavigation({ url: '**/userinfo' });
    } catch (error) {
      console.log(`Didn't Load Test Warning: ${error}`);
    }
  }
};
