import { Button } from "./components/ui/button"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react"

function App() {
  return (
    <>
        <header>
      <SignedOut>
        <SignInButton>
          <Button>
            Sign in
            </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
    </>
  )
}

export default App