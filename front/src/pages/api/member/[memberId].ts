import { MemberApiData } from 'types/todo/type.d';
import { ApiResoinse } from 'types/api/type.d';
import { NextApiRequest, NextApiResponse } from 'next';
import { Member } from 'types/mysql/type';
import logger from 'lib/logger';
import memberRepository from 'ports/member-repository';

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiResoinse<boolean | MemberApiData>>,
) => {
    console.log(req.query, req.body);

    const { memberId } = req.query;

    if (req.method === 'GET') {
        if (memberId == null) {
            logger.warn('required memberId');
            res.status(400);
            return;
        }

        const member: Member | undefined = await memberRepository.fetchBy(
            String(memberId),
        );

        if (member) {
            res.status(200).json({
                data: {
                    memberId: member.member_id,
                    name: member.name,
                } as unknown as MemberApiData,
            });
        } else {
            logger.warn(`not found, memberId=${memberId}`);
            res.status(404);
        }
    } else {
        res.status(403);
    }
};

export default handler;
