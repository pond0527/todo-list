import { MemberApiData } from 'types/todo/type.d';
import { ApiResoinse } from 'types/api/type.d';
import { NextApiRequest, NextApiResponse } from 'next';
import logger from 'lib/logger';
import memberRepository from 'ports/member-repository';

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiResoinse<MemberApiData[]>>,
) => {
    if (req.method === 'GET') {
        try {
            const memberList = await memberRepository.fetchAll();
            logger.info({ memberList: memberList }, 'Get: memberList');

            res.status(200).send({
                data: memberList.map(
                    (data) =>
                        ({
                            memberId: data.member_id,
                            name: data.name,
                            isDeleted: data.is_deleted,
                        } as MemberApiData),
                ),
            });
        } catch (e) {
            logger.warn(e);
            res.status(200).send({ data: [] });
        }
    } else {
        res.status(403);
    }
};

export default handler;
