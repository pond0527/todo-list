import { TodoForm } from 'components/Todo';
import { getMemberList } from 'lib/clients/memberClient';
import { getStatusList } from 'lib/clients/statusClient';
import { getTodo } from 'lib/clients/todoClient';
import { GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import {
    Member,
    Status,
    TodoFormType,
    TodoListJsonData,
} from 'types/todo/type';

type Props = {
    todo: TodoListJsonData;
    memberList: Member[];
    statusList: Status[];
};

const EditTodo = ({ todo, memberList, statusList }: Props) => {
    const router = useRouter();
    const useFormMethods = useForm<TodoFormType>({
        defaultValues: { ...todo },
    });

    return (
        <FormProvider {...useFormMethods}>
            <TodoForm
                mode={'edit'}
                memberList={memberList}
                statusList={statusList}
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
    const todo = await getTodo(context.params.todoId);
    const memberList = await getMemberList();
    const statusList = await getStatusList();

    return {
        props: { todo, memberList, statusList },
    };
};
