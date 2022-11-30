const { LoginPage } = require('../page-objects/login.po');
const { NewClusterPage } = require('../page-objects/newCluster.po');
const { ClusterOverviewPage } = require('../page-objects/clusterOverview.po');
const { NewVmPage } = require('../page-objects/newVm.po');
const { VmOverviewPage } = require('../page-objects/vmOverview.po');

// --------------------------------------------------------------------------
// Helper functions
async function login(page, vuContext, events) {
  const before = performance.now();
  const loginPage = new LoginPage(page, vuContext.vars.target);
  await loginPage.loginWith(vuContext.vars.usermail, vuContext.vars.password, vuContext.vars.loginType);
  const after = performance.now();
  events.emit('counter', 'vusers.login', 1);
  events.emit('histogram', 'vusers.fromLoginPage-tillProfile', (after - before));
}

async function startVM(page, vuContext, events) {
  const before = performance.now();
  const newVmPage = new NewVmPage(page, vuContext.vars.target);
  await newVmPage.goto();
  await newVmPage.selectProject('artilleryVM');
  const fullVmName = await newVmPage.startNormalVM('artilleryVM', 'artillery');
  const after = performance.now();
  events.emit('counter', 'vm.started', 1);
  events.emit('histogram', 'vm.fromNewVmPage-tillStarted', (after - before));
  return fullVmName;
}

async function waitTillVmActive(page, vuContext, events, vmName) {
  const before = performance.now();
  const vmOverviewPage = new VmOverviewPage(page, vuContext.vars.target);
  await vmOverviewPage.goto();
  await vmOverviewPage.waitForInstanceToBeActive(vmName, 12 * 10000);
  const after = performance.now();
  events.emit('counter', 'vm.active', 1);
  events.emit('histogram', 'vm.fromVmOverviewPage-tillActive', (after - before));
}

async function deleteVm(page, vuContext, events, vmName) {
  const before = performance.now();
  const vmOverviewPage = new VmOverviewPage(page, vuContext.vars.target);
  await vmOverviewPage.goto();
  await vmOverviewPage.deleteVirtualMachine(vmName);
  await vmOverviewPage.waitForInstanceToBeDeleted(vmName, 12 * 10000);
  const after = performance.now();
  events.emit('counter', 'vm.deleted', 1);
  events.emit('histogram', 'vm.fromVmOverviewPage-tillDeleted', (after - before));
}

async function startCluster(page, vuContext, events) {
  const before = performance.now();
  const newClusterPage = new NewClusterPage(page, vuContext.vars.target);
  await newClusterPage.goto();
  await newClusterPage.selectProject('artilleryVM');
  const clusterId = await newClusterPage.startCluster('artillery', '2');
  const after = performance.now();
  events.emit('counter', 'cluster.started', 1);
  events.emit('histogram', 'cluster.fromNewClusterPage-tillStarted', (after - before));
  return clusterId;
}

async function waitTillClusterRunning(page, vuContext, events, clusterId) {
  const before = performance.now();
  const clusterOverviewPage = new ClusterOverviewPage(page, vuContext.vars.target);
  await clusterOverviewPage.goto();
  await clusterOverviewPage.waitForClusterToBeRunning(clusterId, 10 * 60000);
  const after = performance.now();
  events.emit('counter', 'cluster.active', 1);
  events.emit('histogram', 'cluster.fromClusterOverviewPage-tillRunning', (after - before));
}

async function deleteCluster(page, vuContext, events, clusterId) {
  const before = performance.now();
  const clusterOverviewPage = new ClusterOverviewPage(page, vuContext.vars.target);
  await clusterOverviewPage.goto();
  await clusterOverviewPage.deleteCluster(clusterId, 12 * 10000);
  await clusterOverviewPage.waitForClusterToBeDeleted(clusterId, 12 * 10000);
  const after = performance.now();
  events.emit('counter', 'cluster.deleted', 1);
  events.emit('histogram', 'cluster.fromClusterOverviewPage-tillDeleted', (after - before));
}

// --------------------------------------------------------------------------
// Main test functions
async function startAndDeleteCluster(page, vuContext, events) {
  await login(page, vuContext, events);
  const clusterId = await startCluster(page, vuContext, events);
  await waitTillClusterRunning(page, vuContext, events, clusterId);
  await deleteCluster(page, vuContext, events, clusterId);
}

async function startAndDeleteVM(page, vuContext, events) {
  await login(page, vuContext, events);
  const fullVmName = await startVM(page, vuContext, events);
  await waitTillVmActive(page, vuContext, events, fullVmName);
  await deleteVm(page, vuContext, events, fullVmName);
}

async function startVmThenStartClusterAndDeleteBothAfterwards(page, vuContext, events) {
  await login(page, vuContext, events);
  const fullVmName = await startVM(page, vuContext, events);
  const clusterId = await startCluster(page, vuContext, events);
  await waitTillClusterRunning(page, vuContext, events, clusterId);
  await deleteCluster(page, vuContext, events, clusterId);
  await waitTillVmActive(page, vuContext, events, fullVmName);
  await deleteVm(page, vuContext, events, fullVmName);
}

module.exports = { startAndDeleteCluster, startAndDeleteVM, startVmThenStartClusterAndDeleteBothAfterwards };
