import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { next?: string }
}) {
  const nextPath = searchParams?.next || '/admin'

  return (
    <main className="mx-auto max-w-md px-4 py-8 sm:py-14">
      <LoginForm nextPath={nextPath} />
    </main>
  )
}
