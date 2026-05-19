// CANVION Node Types
// Every node on the canvas is HTML — this defines the available types

export type NodeCategory = 'content' | 'data' | 'media' | 'layout' | 'interactive';

export interface NodeTypeDef {
  type: string;
  label: string;
  icon: string;
  category: NodeCategory;
  description: string;
  defaultContent: string;
  defaultSize: { width: number; height: number };
  defaultStyle?: React.CSSProperties;
}

export const NODE_TYPES: Record<string, NodeTypeDef> = {
  note: {
    type: 'note',
    label: 'Sticky Note',
    icon: '📝',
    category: 'content',
    description: 'Quick note or idea',
    defaultContent: '<p>Write something...</p>',
    defaultSize: { width: 240, height: 180 },
    defaultStyle: { background: '#fef3c7', borderRadius: '12px', padding: '16px' },
  },
  card: {
    type: 'card',
    label: 'Card',
    icon: '🃏',
    category: 'content',
    description: 'Rich content card with title and body',
    defaultContent: '<h3>Title</h3><p>Card content goes here.</p>',
    defaultSize: { width: 300, height: 200 },
    defaultStyle: { background: '#1e1e2e', borderRadius: '12px', padding: '20px', color: '#e0e0e0' },
  },
  table: {
    type: 'table',
    label: 'Table',
    icon: '📊',
    category: 'data',
    description: 'HTML table for structured data',
    defaultContent: `<table>
  <thead><tr><th>Column 1</th><th>Column 2</th><th>Column 3</th></tr></thead>
  <tbody>
    <tr><td>Data</td><td>Data</td><td>Data</td></tr>
    <tr><td>Data</td><td>Data</td><td>Data</td></tr>
  </tbody>
</table>`,
    defaultSize: { width: 400, height: 200 },
    defaultStyle: { background: '#1a1a2e', borderRadius: '8px', padding: '16px' },
  },
  code: {
    type: 'code',
    label: 'Code Block',
    icon: '💻',
    category: 'content',
    description: 'Syntax-highlighted code snippet',
    defaultContent: '<pre><code>// Your code here\nconsole.log("Hello CANVION");</code></pre>',
    defaultSize: { width: 400, height: 200 },
    defaultStyle: { background: '#0d1117', borderRadius: '8px', padding: '16px', fontFamily: 'monospace' },
  },
  chart: {
    type: 'chart',
    label: 'Chart',
    icon: '📈',
    category: 'data',
    description: 'Data visualization',
    defaultContent: '<div class="chart-placeholder">📊 Chart will render here</div>',
    defaultSize: { width: 400, height: 300 },
    defaultStyle: { background: '#1a1a2e', borderRadius: '12px', padding: '16px' },
  },
  image: {
    type: 'image',
    label: 'Image',
    icon: '🖼️',
    category: 'media',
    description: 'Image or generated visual',
    defaultContent: '<div class="image-placeholder">🖼️ Drop image or generate with AI</div>',
    defaultSize: { width: 300, height: 250 },
    defaultStyle: { background: '#2a2a3e', borderRadius: '8px', padding: '8px' },
  },
  list: {
    type: 'list',
    label: 'List',
    icon: '📋',
    category: 'content',
    description: 'Checklist or bullet list',
    defaultContent: '<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>',
    defaultSize: { width: 250, height: 180 },
    defaultStyle: { background: '#1e1e2e', borderRadius: '12px', padding: '16px', color: '#e0e0e0' },
  },
  section: {
    type: 'section',
    label: 'Section',
    icon: '📐',
    category: 'layout',
    description: 'Group container / section divider',
    defaultContent: '<h4>Section Title</h4>',
    defaultSize: { width: 500, height: 400 },
    defaultStyle: { background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.15)', borderRadius: '16px', padding: '24px' },
  },
  form: {
    type: 'form',
    label: 'Form',
    icon: '📝',
    category: 'interactive',
    description: 'Interactive form with inputs',
    defaultContent: `<form>
  <label>Name</label><input type="text" placeholder="Enter name" />
  <label>Email</label><input type="email" placeholder="Enter email" />
  <button type="button">Submit</button>
</form>`,
    defaultSize: { width: 300, height: 250 },
    defaultStyle: { background: '#1e1e2e', borderRadius: '12px', padding: '20px', color: '#e0e0e0' },
  },
  iframe: {
    type: 'iframe',
    label: 'Embed',
    icon: '🌐',
    category: 'media',
    description: 'Embedded webpage or widget',
    defaultContent: '<div class="iframe-placeholder">🌐 Paste URL to embed</div>',
    defaultSize: { width: 500, height: 400 },
    defaultStyle: { background: '#1a1a2e', borderRadius: '8px', padding: '8px' },
  },
  button: {
    type: 'button',
    label: 'Button',
    icon: '🔘',
    category: 'interactive',
    description: 'Clickable action button',
    defaultContent: '<button class="cvn-btn cvn-btn-primary">Click Me</button>',
    defaultSize: { width: 160, height: 60 },
    defaultStyle: { background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  },
  brain: {
    type: 'brain',
    label: 'Brain Card',
    icon: '🧠',
    category: 'content',
    description: 'AI Brain status/activity card',
    defaultContent: '<div class="brain-card"><span class="brain-avatar">🧠</span><div><strong>Brain</strong><p class="brain-status">Thinking...</p></div></div>',
    defaultSize: { width: 260, height: 100 },
    defaultStyle: { background: 'linear-gradient(135deg, #1a1a3e, #2a1a4e)', borderRadius: '16px', padding: '16px', color: '#e0e0e0', border: '1px solid rgba(139,92,246,0.3)' },
  },
};

export const NODE_CATEGORIES: Record<NodeCategory, { label: string; icon: string }> = {
  content: { label: 'Content', icon: '📝' },
  data: { label: 'Data', icon: '📊' },
  media: { label: 'Media', icon: '🖼️' },
  layout: { label: 'Layout', icon: '📐' },
  interactive: { label: 'Interactive', icon: '🔘' },
};

export function getNodeType(type: string): NodeTypeDef {
  return NODE_TYPES[type] || NODE_TYPES['card'];
}
