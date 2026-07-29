export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
