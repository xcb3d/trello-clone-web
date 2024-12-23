import { useColorScheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MDEditor from '@uiw/react-md-editor'
import { useState } from 'react'
import rehypeSanitize from 'rehype-sanitize'
import EditNoteIcon from '@mui/icons-material/EditNote'


const markdownValueExample =`
  *\`Markdown Content Example:\`*
  **Hello world | ZCode - EVA on Top**
  [![](https://res.cloudinary.com/dvbosn50d/image/upload/v1734407565/users/kiw6wd1v21iobxpj4n43.jpg)](https://res.cloudinary.com/dvbosn50d/image/upload/v1734407565/users/kiw6wd1v21iobxpj4n43.jpg)
  \`\`\`javascript
  import React from "react"
  import ReactDOM from "react-dom"
  import MDEditor from '@uiw/react-md-editor'
  \`\`\`
`

function CardDescriptionMdEditor({ cardDescriptionProp, onChangedValue}) {
  const { mode } = useColorScheme()
  const [markdownEditMode, setMarkdownEditMode] = useState(false)
  const [cardDescription, setCardDescription] = useState(cardDescriptionProp)

  const updateCardDescription = () => {
    setMarkdownEditMode(false)
  }

  return (
    <Box sx={{ mt: -4 }} >
      {markdownEditMode ? (
        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box data-color-mode={mode}>
            <MDEditor
              value={cardDescription}
              onChange={setCardDescription}
              previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
              height={400}
              preview='edit'
            />
          </Box>
          <Button
            sx={{ alignSelf: 'flex-end' }}
            onClick={() => {
              updateCardDescription()
              onChangedValue(cardDescription)
            }}
            className='intereptor-loading'
            type='button'
            variant='contained'
            size='small'
            color='info'
          >
            Save
          </Button>
        </Box>
      ) : <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          sx={{ alignSelf: 'flex-end' }}
          onClick={() => {setMarkdownEditMode(true)}}
          type='button'
          variant='contained'
          color='info'
          size='smail'
          startIcon={<EditNoteIcon />}
        >
          Edit
        </Button>
        <Box data-color-mode={mode}>
          <MDEditor.Markdown 
            source={cardDescription}
            style={{
              whiteSpace: 'pre-wrap',
              padding: cardDescription ? '10px' : '0',
              border: cardDescription ? '0.5px solid rgba(0, 0, 0, 0.2)' : 'none', 
              borderRadius: '8px'
            }}
          />
        </Box>
      </Box>}
    </Box>
  )
}

export default CardDescriptionMdEditor
