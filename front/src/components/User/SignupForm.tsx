import clsx from 'clsx';
import { registerUser } from 'lib/clients/userClient';
import { useToast } from 'lib/toast';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { UserFormType } from 'types/user/type';

type Props = {
    // mode: Mode;
    onComplete?: VoidFunction;
    // onBack?: VoidFunction;
};

export const SignupForm = ({ onComplete }: Props) => {
    const { register, getValues, formState } = useForm<UserFormType>();

    const { toast } = useToast();

    const handleSignup = useCallback(async () => {
        try {
            const isSuccess = await registerUser(getValues());
            if (isSuccess) {
                toast.success('保存しました。');
                onComplete?.();
            } else {
                toast.error(`エラーが発生しました。（原因不明）`);
            }
        } catch (e) {
            toast.error(`エラーが発生しました。（${(e as Error)?.message}）`);
        }
    }, [getValues, toast]);

    return (
        <form className={clsx('form row g-3 align-items-center')}>
            <div className="col-auto">
                <label
                    htmlFor="username"
                    className="form-label visually-hidden"
                >
                    ユーザー名
                </label>
                <input
                    type="text"
                    className="form-control"
                    {...register('name', { required: true })}
                />
            </div>

            <div className="col-auto">
                <label
                    htmlFor="username"
                    className="form-label visually-hidden"
                >
                    パスワード
                </label>
                <input
                    type="password"
                    className="form-control"
                    {...register('password', { required: true })}
                />
            </div>

            <div className="col-auto">
                <button
                    type="button"
                    className={clsx('btn btn-primary')}
                    onClick={handleSignup}
                    disabled={!formState.isValid}
                >
                    Sign up
                </button>
            </div>
        </form>
    );
};
