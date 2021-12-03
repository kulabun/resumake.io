import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import { useMutation } from 'react-query'
import styled from 'styled-components'
import { generateResume } from '../../../api/generateResume'
import { formAtom } from '../../../atoms/form'
import { colors, sizes } from '../../../theme'

const Section = styled.section`
  width: ${sizes.previewSection.width};
  background: ${colors.background};
  border-left: 1px solid rgba(0, 0, 0, 0.5);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
`
console.log(import.meta.env)

const StyledPage = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;

  canvas {
    max-width: 95% !important;
    height: auto !important;
  }
`

export function Preview() {
  const [formState] = useAtom(formAtom)
  const { mutate, data } = useMutation(generateResume)
  const initialScale = document.body.clientWidth > 1440 ? 1.75 : 1
  const [scale, setScale] = useState(initialScale)

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = import.meta.env.CLIENT_PDF_WORKER_SRC
  }, [])

  useEffect(() => {
    mutate(formState)
  }, [formState.basics.fullName])

  return (
    <Section>
      {data && (
        <Document file={data}>
          <StyledPage pageNumber={1} scale={scale} />
        </Document>
      )}
    </Section>
  )
}