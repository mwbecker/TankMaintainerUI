/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_REACT_API_BASE_URL: string
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv
}