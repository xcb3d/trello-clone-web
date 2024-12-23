// import { Box, Card, CardContent, Container, Divider, Pagination, PaginationItem, Stack, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import ListAltIcon from '@mui/icons-material/ListAlt'
import HomeIcon from '@mui/icons-material/Home'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import randomColor from 'randomcolor'
import SidebarCreateBoardModal from './create'
import { fetchBoardsAPI } from '~/apis'
import { CardMedia } from '@mui/material'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',

    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
  }
}))
function Boards() {
  // Số lượng bản ghi boards hiển thị tối đa trên 1 page
  const [boards, setBoards] = useState(null)
  // Tổng số lượng bản ghi boards có trong database
  const [totalBoards, setTotalBoards] = useState(null)
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const page = parseInt(query.get('page') || '1', 10)

  const updateState = (res) => {
    setBoards(res.boards || [])
    setTotalBoards(res.totalBoards || 0)
  }

  useEffect(() => {
    // Fake tạm data
    // setBoards([...Array(16)].map((_, i) => i))
    // setTotalBoards(100)

    //  Gọi API lấy danh sách board ở đây
    fetchBoardsAPI(location.search).then((res) => {
      updateState(res)
    })
  }, [location.search])

  const afterCreateNewBoard = () => {
    fetchBoardsAPI(location.search).then((res) => {
      updateState(res)
    })
  }

  if (!boards) {
    return <PageLoadingSpinner caption='Loading board'/>
  }
  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box sx={{ paddingX: 2, my: 4, display: 'flex', justifyContent: 'space-between', flexDirection: 'column', height: 'calc(100vh - 128px)'}}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={3}>
            <Stack direction='column' spacing={1}>
              <SidebarItem className='active'>
                <SpaceDashboardIcon fontSize='small'/>
                Boards
              </SidebarItem>
              <SidebarItem>
                <ListAltIcon fontSize='small'/>
                Template
              </SidebarItem>
              <SidebarItem>
                <HomeIcon fontSize='small'/>
                Home
              </SidebarItem>
            </Stack>
            <Divider sx={{ my: 1 }}/>
            <Stack direction='column' spacing={1}>
              <SidebarCreateBoardModal afterCreateNewBoard={afterCreateNewBoard}/>
            </Stack>
          </Grid>

          <Grid xs={12} sm={9}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Your boards: </Typography>
            {boards?.length === 0 &&
              <Typography variant="span" sx={{ fontWeight: 'bold', mb: 3 }}>No result found!</Typography>
            }
            <Grid container spacing={2}>
              {boards.map(b =>(
                <Grid xs={2} sm={3} md={4} key={b._id}>
                  <Card sx={{ width: '250px' }}>
                    {/* Mở rộng làm cover cho board */}
                    {/* <CardMedia component="img" height="100" src={`https://picsum.photos/seed/${Math.random()}/200/300`} /> */}
                    <Box sx={{ height: '50px', background: randomColor() }}></Box>

                    <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                      <Typography gutterBottom variant="h6" component="div">{b.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {b.description}
                      </Typography>
                      <Box
                        component={Link}
                        to={`/boards/${b._id}`}
                        sx={{
                          mt: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          color: 'primary.main',
                          '&:hover':
                          { color: 'primary.light' }
                        }}>
                          Go to board <ArrowRightIcon fontSize="small" />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        {(totalBoards > 0) && <Box sx={{ my: 3, pr: 5, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            size="large"
            color="secondary"
            showFirstButton
            showLastButton
            count={Math.ceil(totalBoards / 12)}
            page={page}
            renderItem={(item) => (
              <PaginationItem
                component={Link}
                to={`/boards${item.page === 1 ? ' ': `?page=${item.page}`}`}
                {...item}
              />
            )}
          />
        </Box>}
      </Box>
    </Container>
  )
}

export default Boards
