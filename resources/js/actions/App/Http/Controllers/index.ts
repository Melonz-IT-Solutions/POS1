import DashboardController from './DashboardController'
import Settings from './Settings'
import POS from './POS'
import Admin from './Admin'

const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    Settings: Object.assign(Settings, Settings),
    POS: Object.assign(POS, POS),
    Admin: Object.assign(Admin, Admin),
}

export default Controllers