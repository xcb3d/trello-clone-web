import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Tab from '@mui/material/Tab'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AppBar from '~/components/AppBar/AppBar'
import PersonIcon from '@mui/icons-material/Person'
import SecurityIcon from '@mui/icons-material/Security'
import AccountTab from './AccountTab'
import SecurityTab from './SecurityTab'

const TABS = {
  ACCOUNT: 'account',
  SECURITY: 'security'
}

function Settings() {
  const location = useLocation()
  const getDefaultTab = () => {
    if (location.pathname.includes(TABS.ACCOUNT)) return TABS.ACCOUNT
    return TABS.SECURITY
  }
  const [activeTab, setActiveTab] = useState(getDefaultTab())

  const handleChangeTab = (event, selectedTab) => { setActiveTab(selectedTab) }
  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab}>
            <Tab label="Account" value={TABS.ACCOUNT} icon={<PersonIcon />} component={Link} to="/account"/>
            <Tab label="Security" value={TABS.SECURITY} icon={<SecurityIcon />} component={Link} to="/security"/>
          </TabList>
        </Box>
        <TabPanel value={TABS.ACCOUNT}><AccountTab /></TabPanel>
        <TabPanel value={TABS.SECURITY}><SecurityTab /></TabPanel>
      </TabContext>
    </Container>
  )
}

export default Settings