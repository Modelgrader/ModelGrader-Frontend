import { Editor } from '@monaco-editor/react'
import { MONACO_EDITOR_OPTIONS } from "@/lib/fonts"

const MonacoEditor = () => {
  return (
    <div className=''>
        <Editor theme='vs-dark'  height="35vh" defaultLanguage="python" options={MONACO_EDITOR_OPTIONS}/>
    </div>
  )
}

export default MonacoEditor