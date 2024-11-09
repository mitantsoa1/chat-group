<?php

namespace App\Repository;

use App\Entity\Groups;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Groups>
 */
class GroupsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Groups::class);
    }

    public function findIsGroupMember(Groups $group, int $memberId): array
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = '
            SELECT g.*
            FROM `groups` g
            WHERE (JSON_CONTAINS(g.members, :memberId) = 1) AND g.id = :groupId
        ';

        $stmt = $conn->prepare($sql);
        $result = $stmt->executeQuery([
            'memberId' => json_encode($memberId),
            'groupId' => $group->getId()
        ]);

        return $result->fetchAllAssociative();
    }

    public function findGroupsMember(User $user): array
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = '
            SELECT g.*
            FROM `groups` g
            WHERE (JSON_CONTAINS(g.members, :memberId) = 1)
        ';

        $stmt = $conn->prepare($sql);
        $result = $stmt->executeQuery([
            'memberId' => json_encode($user->getId())
        ]);

        return $result->fetchAllAssociative();
    }
}
