import { Layout } from 'components/Layout';
import { SignupForm } from 'components/User';

const SignUp = (): JSX.Element => {
    return (
        <Layout pageTitle="Sign up">
            <SignupForm />
        </Layout>
    );
};

export default SignUp;
