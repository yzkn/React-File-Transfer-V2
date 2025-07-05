import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

import FileSelector from './FileSelector.jsx';

function App() {
  return (
    <>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Grid container alignItems="center" justify="center">
            <Grid item size={4} offset={4} sx={{ mt: "64px", mb: "64px" }}>
              <FileSelector />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default App
