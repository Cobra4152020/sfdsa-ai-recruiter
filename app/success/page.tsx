import { UserProvider } from "@/context/user-context"
import { SuccessContent } from "@/components/success-content"

export default function SuccessPage() {
  return (
    <UserProvider>
      <SuccessContent />
    </UserProvider>
  )
}