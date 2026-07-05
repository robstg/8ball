// studio/components/HtmlEmbedInput.tsx
// v1 - live preview iframe for HTML embed fields
import React, {useCallback, useState} from 'react'
import {Card, Stack, TextArea, Text, Box} from '@sanity/ui'
import {set, unset} from 'sanity'
import type {StringInputProps} from 'sanity'

export function HtmlEmbedInput(props: StringInputProps) {
  const {value, onChange, elementProps} = props
  const [code, setCode] = useState(value || '')

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const nextValue = event.currentTarget.value
      setCode(nextValue)
      onChange(nextValue ? set(nextValue) : unset())
    },
    [onChange]
  )

  return (
    <Stack space={3}>
      <TextArea
        {...elementProps}
        value={code}
        onChange={handleChange}
        rows={12}
        style={{fontFamily: 'monospace', fontSize: '13px'}}
      />
      <Box>
        <Text size={1} weight="semibold" muted style={{marginBottom: '6px', display: 'block'}}>
          Live preview
        </Text>
        <Card padding={0} radius={2} shadow={1} style={{overflow: 'hidden', background: '#fff'}}>
          <iframe
            title="HTML embed preview"
            srcDoc={code}
            sandbox="allow-scripts"
            style={{width: '100%', height: '380px', border: 'none', display: 'block'}}
          />
        </Card>
      </Box>
    </Stack>
  )
}