export const Constants = {
    public: {
        Enums: {
            beta_application_status: ["pending", "approved", "denied"],
            beta_reader_status: ["not_applied", "pending", "approved", "rejected"],
            content_block_type: [
                "heading_1",
                "heading_2",
                "heading_3",
                "paragraph",
                "bullet_list",
                "ordered_list",
                "image",
                "table",
                "quote",
                "code",
                "divider",
            ],
            discount_type: ["percentage", "fixed_amount"],
            product_type: ["single_issue", "bundle", "chapter_pass", "arc_pass"],
            subscription_status: [
                "incomplete",
                "incomplete_expired",
                "trialing",
                "active",
                "past_due",
                "canceled",
                "unpaid",
                "paused",
            ],
            user_role: ["admin", "support", "accountant", "user", "super_admin"],
            work_status: ["planning", "writing", "editing", "published", "on_hold"],
            work_type: ["book", "volume", "saga", "arc", "issue"],
        },
    },
};
//# sourceMappingURL=database.types.js.map