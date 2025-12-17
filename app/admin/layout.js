// app/admin/layout.tsx
import '../globals.css';

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}