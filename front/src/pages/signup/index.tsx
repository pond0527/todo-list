import { Layout } from 'components/Layout';
import { SignupForm } from 'components/User';
import router from 'next/router';

const SignUp = (): JSX.Element => {
    return (
        <Layout pageTitle="Sign up">
            <SignupForm onComplete={() => router.push('/api/auth/signin')} />
        </Layout>
    );
};

export default SignUp;
