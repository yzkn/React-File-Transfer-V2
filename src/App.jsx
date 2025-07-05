import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import FileSelector from './FileSelector.jsx';

function App() {
  return (
    <>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <FileSelector />
        </CardContent>
      </Card>
    </>
  )
}

export default App
