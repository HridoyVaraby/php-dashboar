<?php
namespace App\Models;

class Opinion extends Model {
    protected string $table = 'opinions';

    public function paginate(int $page = 1, int $perPage = 10, string $search = ''): array
    {
        $offset = ($page - 1) * $perPage;
        $params = [];
        $where = [];

        $sql = "SELECT * FROM opinions";

        if (!empty($search)) {
            $where[] = "(title LIKE ? OR author_name LIKE ?)";
            $params[] = '%' . $search . '%';
            $params[] = '%' . $search . '%';
        }

        if (!empty($where)) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }

        // Count total
        $countSql = "SELECT COUNT(*) FROM opinions";
        if (!empty($where)) {
            $countSql .= ' WHERE ' . implode(' AND ', $where);
        }
        $stmt = self::getConnection()->prepare($countSql);
        $stmt->execute($params);
        $total = $stmt->fetchColumn();

        // Fetch data
        $sql .= " ORDER BY created_at DESC LIMIT $perPage OFFSET $offset";
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
