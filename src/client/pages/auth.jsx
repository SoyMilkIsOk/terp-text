import { LoginForm } from "@wasp/auth/forms/Login";
import { SignupForm } from "@wasp/auth/forms/Signup";
import { VerifyEmailForm } from "@wasp/auth/forms/VerifyEmail";
import { ForgotPasswordForm } from "@wasp/auth/forms/ForgotPassword";
import { ResetPasswordForm } from "@wasp/auth/forms/ResetPassword";
import { Link } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";
import { authAppearance } from "../appearance.js";

export function Login() {
  return (
    <Layout>
      <LoginForm appearance={authAppearance} />
      <br />
      <span className="text-sm font-medium text-gray-900">
        Don't have an account yet?{" "}
        <ChakraLink as={Link} to="/signup" color="blue.500">
          go to signup
        </ChakraLink>
        .
      </span>
      <br />
      <span className="text-sm font-medium text-gray-900">
        Forgot your password?{" "}
        <ChakraLink as={Link} to="/request-password-reset" color="blue.500">
          reset it
        </ChakraLink>
        .
      </span>
    </Layout>
  );
}

export function Signup() {
  return (
    <Layout>
      <SignupForm appearance={authAppearance} />
      <br />
      <span className="text-sm font-medium text-gray-900">
        I have an account,{" "}
        <ChakraLink as={Link} to="/login" color="blue.500">
          go to login
        </ChakraLink>
      </span>
    </Layout>
  );
}

export function EmailVerification() {
  return (
    <Layout>
      <VerifyEmailForm appearance={authAppearance} />
      <br />
      <span className="text-sm font-medium text-gray-900">
        If everything is okay,{" "}
        <ChakraLink as={Link} to="/login" color="blue.500">
          go to login
        </ChakraLink>
      </span>
    </Layout>
  );
}

export function RequestPasswordReset() {
  return (
    <Layout>
      <ForgotPasswordForm appearance={authAppearance} />
    </Layout>
  );
}

export function PasswordReset() {
  return (
    <Layout>
      <ResetPasswordForm appearance={authAppearance} />
      <br />
      <span className="text-sm font-medium texLinkt-gray-900">
        If everything is okay,{" "}
        <ChakraLink as={Link} to="/login" color="blue.500">
          go to login
        </ChakraLink>
      </span>
    </Layout>
  );
}

// A layout component to center the content
export function Layout({ children }) {
  return (
    <div className="w-full h-full bg-white">
      <div className="min-w-full min-h-[75vh] flex items-center justify-center">
        <div className="w-full h-full max-w-sm p-5 bg-white">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
