import { TodoForm } from 'components/Todo';
import { TODO_STATUS_LIST } from 'constants/todo/status';
import { getMemberList } from 'lib/clients/memberClient';
import { getTodo } from 'lib/clients/todoClient';
import { GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import { useLayoutEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
    MemberApiData,
    TodoFormType,
} from 'types/todo/type';

type Props = {
    memberList: MemberApiData[];
};

const EditTodo = ({ memberList }: Props) => {
    const router = useRouter();
    const { todoId } = router.query;
    const useFormMethods = useForm<TodoFormType>();

    useLayoutEffect(() => {
        if (!router.isReady || !todoId) {
            return;
        }

        (async () => {
            const todo = await getTodo(String(todoId));
            useFormMethods.reset({ ...todo });
            console.log(todoId, todo);
        })();
    }, [router.isReady, todoId, useFormMethods]);


    return (
        <FormProvider {...useFormMethods}>
            <TodoForm
                mode={'edit'}
                memberList={memberList}
                statusList={TODO_STATUS_LIST}
                onComplete={() => router.push('/todo')}
                onBack={() => router.back()}
            />
        </FormProvider>
    );
};

export default EditTodo;

export const getServerSideProps = async (
    context: any,
): Promise<GetServerSidePropsResult<Props>> => {
    const memberList = await getMemberList();

    return {
        props: { memberList },
    };
};
