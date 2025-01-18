import clsx from 'clsx';
import { Layout } from 'components/Layout';
import { useToast } from 'lib/toast';
import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { UserFormType } from 'types/user/type';

const SignUp: NextPage = () => {
    const { register, getValues } = useForm<UserFormType>();
    const { toast } = useToast();

    return (
        <Layout
            pageTitle="Sign up"
            // rightItems={
            //     <>
            //         <button
            //             className={clsx('btn btn-primary', styles.btn)}
            //             onClick={handleClickCreate}
            //         >
            //             新規作成
            //         </button>
            //     </>
            // }
        >
            <form className={clsx('form')}>
                <label className={clsx('form-label')}>ユーザー名</label>
                <input type="text" {...register('name', { required: true })} />

                <label className={clsx('form-label')}>パスワード</label>
                <input
                    type="password"
                    {...register('password', { required: true })}
                />

                <button
                    className={clsx('btn btn-primary')}
                    onClick={async () => {
                        await fetch(`http://localhost:3000/api/user`, {
                            method: 'POST',
                            body: JSON.stringify(getValues()),
                        });

                        toast.success('保存しました。');
                    }}
                >
                    登録
                </button>
            </form>
        </Layout>
    );
};

export default SignUp;
