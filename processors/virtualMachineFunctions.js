const { LoginPage } = require('../page-objects/login.po');
const { NewVmPage } = require('../page-objects/newVm.po');
const { VmOverviewPage } = require('../page-objects/vmOverview.po');

async function startVM(page, vuContext, events) {
  const loginPage = new LoginPage(page, vuContext.vars.target);
  await loginPage.withOrcid(vuContext.vars.usermail, vuContext.vars.password);
  events.emit('counter', 'vusers.login', 1);
  const newVmPage = new NewVmPage(page, vuContext.vars.target);
  await newVmPage.goto();
  const beforeSelectProject = performance.now();
  await newVmPage.selectProject('artilleryVM');
  const fullVmName = await newVmPage.startNormalVM('artilleryVM', 'artillery');
  const afterStartVm = performance.now();
  events.emit('counter', 'vusers.vm_started', 1);
  events.emit('histogram', 'vm.start_histogram', (afterStartVm - beforeSelectProject));
  const vmOverviewPage = new VmOverviewPage(page, vuContext.vars.target);
  await vmOverviewPage.goto();
  await vmOverviewPage.waitForInstanceToBeActive(fullVmName, 12 * 10000);
  const afterVMActive = performance.now();
  events.emit('counter', 'vusers.vm_active', 1);
  events.emit('histogram', 'vm.active_histogram', (afterVMActive - afterStartVm));
  await vmOverviewPage.deleteVirtualMachine(fullVmName, 12 * 10000);
  await vmOverviewPage.waitForInstanceToBeDeleted(fullVmName, 12 * 10000);
  const afterVMDeleted = performance.now();
  events.emit('counter', 'vusers.vm_deleted', 1);
  events.emit('histogram', 'vm.active_histogram', (afterVMDeleted - afterVMActive));
}

module.exports = { startVM };
