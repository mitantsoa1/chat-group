<?php

namespace App\Repository;

use App\Entity\Message;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\DBAL\Connection;

/**
 * @extends ServiceEntityRepository<Message>
 */
class MessageRepository extends ServiceEntityRepository
{
    private $connection;

    public function __construct(ManagerRegistry $registry, Connection $connection)
    {
        parent::__construct($registry, Message::class);
        $this->connection = $connection;
    }

    //    /**
    //     * @return Message[] Returns an array of Message objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('m.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Message
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    public function findByUser(User $user, int $friendId): array
    {
        return $this->findBy(['user' => $user, 'friendId' => $friendId], ['createdAt' => 'DESC']);
    }

    // public function findMessagesWithSendTo(User $user, int $groupId): array
    // {
    //     $sql = 'SELECT * FROM message WHERE JSON_CONTAINS(send_to, :id, "$")  ORDER BY created_at ASC';
    //     $stmt = $this->connection->executeQuery($sql, ['id' => json_encode($groupId)]);

    //     return $stmt->fetchAllAssociative();
    // }

    public function findMessagesWithSendTo(User $user, int $groupId): array
    {
        $sql = '
            SELECT m.*, 
                   u.id as user_id,
                   u.email,
                   u.roles,
                   u.username
            FROM message m INNER JOIN user u ON m.user_id = u.id WHERE JSON_CONTAINS(m.send_to, :id, "$") ORDER BY m.created_at ASC
        ';

        $stmt = $this->connection->executeQuery($sql, [
            'id' => json_encode($groupId)
        ]);

        $results = $stmt->fetchAllAssociative();

        // Formater les résultats pour avoir une structure plus claire
        return array_map(function ($row) {
            return [
                'message' => [
                    'id' => $row['id'],
                    'body' => $row['body'],
                    'created_at' => $row['created_at'],
                    'send_to' => json_decode($row['send_to'], true)
                ],
                'user' => [
                    'id' => $row['user_id'],
                    'email' => $row['email'],
                    'roles' => json_decode($row['roles'], true),
                    'username' => $row['username'],
                ]
            ];
        }, $results);
    }
}
