export interface FieldStyle {
  width?: string
  height?: string
  minHeight?: string
  backgroundColor?: string
  color?: string
  fontWeight?: string
  fontSize?: string
  padding?: string
  borderRadius?: string
  border?: string
  margin?: string
  textAlign?: string
  lineHeight?: string
  letterSpacing?: string
  boxShadow?: string
  outline?: string
  textDecoration?: string
  textTransform?: string
  display?: string
  flexDirection?: string
  gap?: string
  alignItems?: string
  marginBottom?: string
  fontFamily?: string
  whiteSpace?: string
}

export interface FieldConfig {
  id: string
  label: string
  type: "text" | "email" | "number" | "date" | "textarea" | "tel" | "list" | "ordered-list"| "select" 
  required?: boolean
  placeholder?: string
  styleForm?: FieldStyle
  styleDisplay?: FieldStyle
  labelStyle?: FieldStyle
  containerStyle?: FieldStyle
  listItems?: string[]
  maxItems?: number
  order?: number
}

export interface SectionConfig {
  id: string
  title: string
  fields: FieldConfig[]
  order?: number
}

export interface ThemeConfig {
  id: string
  name: string
  type: "template" | "field"
  styles: FieldStyle
  isDefault?: boolean
}

export interface InvoiceTemplate {
  id: string
  name: string
  sections: SectionConfig[]
  themeId?: string
  description?: string
}

export interface InvoiceData {
  [fieldId: string]: string | string[]
}
