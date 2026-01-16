<?php
namespace App\Models;

use PDO;

class Post extends Model {
    protected string $table = 'posts';

    public function paginate(int $page = 1, int $perPage = 10, array $filters = []): array
    {
        $offset = ($page - 1) * $perPage;
        $params = [];
        $where = [];

        $sql = "SELECT p.*, c.name as category_name, u.full_name as author_name
                FROM posts p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN profiles u ON p.author_id = u.id";

        // Search
        if (!empty($filters['search'])) {
            $where[] = "(p.title LIKE ? OR p.content LIKE ?)";
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        // Category
        if (!empty($filters['category_id'])) {
            $where[] = "p.category_id = ?";
            $params[] = $filters['category_id'];
        }

        // Status
        if (!empty($filters['status'])) {
            $where[] = "p.status = ?";
            $params[] = $filters['status'];
        }

        if (!empty($where)) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }

        // Count total for pagination
        $countSql = "SELECT COUNT(*) FROM posts p";
        if (!empty($where)) {
            $countSql .= ' WHERE ' . implode(' AND ', $where);
        }
        $stmt = self::getConnection()->prepare($countSql);
        // We need to bind params correctly for count as well.
        // Ideally we'd separate query building, but for now reuse params.
        $stmt->execute($params);
        $total = $stmt->fetchColumn();

        // Finalize fetch query
        $sql .= " ORDER BY p.created_at DESC LIMIT $perPage OFFSET $offset";

        $stmt = self::getConnection()->prepare($sql);
        $stmt->execute($params);
        $data = $stmt->fetchAll();

        return [
            'data' => $data,
            'total' => $total,
            'per_page' => $perPage,
            'current_page' => $page,
            'last_page' => ceil($total / $perPage),
        ];
    }
}
