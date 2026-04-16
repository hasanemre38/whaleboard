export const metadata = { title: 'WhaleBoard', description: 'Kripto Takip' }
export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body style={{margin:0,padding:0,background:'#040810'}}>{children}</body>
    </html>
  )
}
