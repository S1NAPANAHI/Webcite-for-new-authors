-- =====================================================
-- SAMPLE CHAPTER DATA FOR TESTING
-- Creates sample issues and chapters for the reader
-- =====================================================

-- Insert sample issues if none exist
DO $$ 
BEGIN
    -- Only insert if content_items table exists and has no issues
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'content_items') 
       AND NOT EXISTS (SELECT 1 FROM content_items WHERE type = 'issue') THEN
        
        INSERT INTO content_items (id, type, title, slug, status, metadata) VALUES
        ('11111111-1111-1111-1111-111111111111', 'issue', 'The Zoroaster Chronicles: Book 1', 'zoroaster-chronicles-book-1', 'published', '{"description": "The first book in the epic Zoroaster Chronicles series", "cover_image": "/images/book1-cover.jpg"}'),
        ('22222222-2222-2222-2222-222222222222', 'issue', 'The Flame Eternal: Book 2', 'flame-eternal-book-2', 'published', '{"description": "The second installment of the Zoroaster Chronicles", "cover_image": "/images/book2-cover.jpg"}'),
        ('33333333-3333-3333-3333-333333333333', 'issue', 'Darkness Rising: Book 3', 'darkness-rising-book-3', 'draft', '{"description": "The third book - work in progress", "cover_image": "/images/book3-cover.jpg"}')
        ON CONFLICT (id) DO NOTHING;
        
        RAISE NOTICE 'Sample issues created successfully!';
    END IF;
END $$;

-- Insert sample chapters if none exist
DO $$ 
BEGIN
    -- Only insert if chapters table exists and has no chapters
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'chapters') 
       AND NOT EXISTS (SELECT 1 FROM chapters) THEN
        
        INSERT INTO chapters (
            id,
            issue_id,
            title,
            slug,
            chapter_number,
            content,
            plain_content,
            status,
            published_at,
            metadata
        ) VALUES
        (
            'aaaaaaaa-1111-1111-1111-111111111111',
            '11111111-1111-1111-1111-111111111111',
            'The Dream of Fire',
            'the-dream-of-fire',
            1,
            '{
                "type": "doc",
                "content": [
                    {
                        "type": "paragraph",
                        "content": [{
                            "type": "text",
                            "text": "In the depths of night, when the world lay silent and the stars whispered ancient secrets, Darius found himself standing in a realm that existed between dreams and reality. The air shimmered with an otherworldly heat, and before him stretched a vast temple wreathed in eternal flames."
                        }]
                    },
                    {
                        "type": "paragraph",
                        "content": [{
                            "type": "text",
                            "text": "The flames danced with a life of their own, reaching toward the heavens as if trying to touch the face of Ahura Mazda himself. Each flicker told a story, each ember carried the weight of ancient wisdom. Darius felt drawn forward, his feet moving of their own accord across the sacred ground."
                        }]
                    },
                    {
                        "type": "paragraph",
                        "content": [{
                            "type": "text",
                            "text": "You have been chosen, a voice resonated through the temple, neither male nor female, but something far more ancient and profound. The eternal struggle between light and darkness requires a champion, one who can bridge both worlds and understand the balance that must be maintained."
                        }]
                    },
                    {
                        "type": "paragraph",
                        "content": [{
                            "type": "text",
                            "text": "As the words echoed through his consciousness, Darius felt a warmth spreading through his chest, not unlike the sacred fire before him. It was then that he understood—this was no mere dream, but a calling that would change the very fabric of his existence."
                        }]
                    },
                    {
                        "type": "paragraph",
                        "content": [{
                            "type": "text",
                            "text": "The temple began to fade as dawn approached, but the memory of the flames and the divine voice would remain with him forever. When Darius awakened in his simple bed in the village of Persepolis, he knew that his life as he had known it was over. The real journey was about to begin."
                        }]
                    }
                ]
            }',
            'In the depths of night, when the world lay silent and the stars whispered ancient secrets, Darius found himself standing in a realm that existed between dreams and reality. The air shimmered with an otherworldly heat, and before him stretched a vast temple wreathed in eternal flames. The flames danced with a life of their own, reaching toward the heavens as if trying to touch the face of Ahura Mazda himself. Each flicker told a story, each ember carried the weight of ancient wisdom. Darius felt drawn forward, his feet moving of their own accord across the sacred ground. You have been chosen, a voice resonated through the temple, neither male nor female, but something far more ancient and profound. The eternal struggle between light and darkness requires a champion, one who can bridge both worlds and understand the balance that must be maintained. As the words echoed through his consciousness, Darius felt a warmth spreading through his chest, not unlike the sacred fire before him. It was then that he understood—this was no mere dream, but a calling that would change the very fabric of his existence. The temple began to fade as dawn approached, but the memory of the flames and the divine voice would remain with him forever. When Darius awakened in his simple bed in the village of Persepolis, he knew that his life as he had known it was over. The real journey was about to begin.',
            'published',
            NOW(),
            '{"tags": ["introduction", "dream_sequence", "calling"], "estimated_read_time": 5}'
        ),
        (
            'bbbbbbbb-1111-1111-1111-111111111111',
            '11111111-1111-1111-1111-111111111111',
            'The Sacred Fire',
            'the-sacred-fire',
            2,
            '{
                "type": "doc",
                "content": [
                    {
                        "type": "paragraph",
                        "content": [{
                            "type": "text",
                            "text": "The morning sun cast long shadows across the ancient stones of Persepolis as Darius made his way to the Fire Temple. The dream still lingered in his mind like incense in sacred halls, each memory as vivid as the flames he had witnessed."
                        }]
                    },
                    {
                        "type": "paragraph",
                        "content": [{
                            "type": "text",
                            "text": "Zoroaster, the wise teacher and prophet, was already waiting in the inner sanctum when Darius arrived. His eyes, ancient beyond his years, seemed to see through the young man\'s very soul."
                        }]
                    },
                    {
                        "type": "paragraph",
                        "content": [{
                            "type": "text",
                            "text": "You have seen the eternal flame, Zoroaster said without preamble, his voice carrying the weight of divine knowledge. Few are granted such visions, and fewer still understand their significance. Tell me, young Darius, what did you feel when you stood before Ahura Mazda\'s sacred fire?"
                        }]
                    },
                    {
                        "type": "paragraph",
                        "content": [{
                            "type": "text",
                            "text": "Darius knelt before his teacher, the words flowing from him like water from a spring. He described the temple, the voice, the overwhelming sense of purpose that had filled his being. As he spoke, he noticed the sacred fire in the temple growing brighter, as if responding to his words."
                        }]
                    }
                ]
            }',
            'The morning sun cast long shadows across the ancient stones of Persepolis as Darius made his way to the Fire Temple. The dream still lingered in his mind like incense in sacred halls, each memory as vivid as the flames he had witnessed. Zoroaster, the wise teacher and prophet, was already waiting in the inner sanctum when Darius arrived. His eyes, ancient beyond his years, seemed to see through the young man\'s very soul. You have seen the eternal flame, Zoroaster said without preamble, his voice carrying the weight of divine knowledge. Few are granted such visions, and fewer still understand their significance. Tell me, young Darius, what did you feel when you stood before Ahura Mazda\'s sacred fire? Darius knelt before his teacher, the words flowing from him like water from a spring. He described the temple, the voice, the overwhelming sense of purpose that had filled his being. As he spoke, he noticed the sacred fire in the temple growing brighter, as if responding to his words.',
            'published',
            NOW(),
            '{"tags": ["zoroaster", "teaching", "fire_temple"], "estimated_read_time": 4}'
        ),
        (
            'cccccccc-1111-1111-1111-111111111111',
            '11111111-1111-1111-1111-111111111111',
            'The First Trial',
            'the-first-trial',
            3,
            '{
                "type": "doc",
                "content": [
                    {
                        "type": "paragraph",
                        "content": [{
                            "type": "text",
                            "text": "Three days had passed since Darius first spoke with Zoroaster about his divine vision. Now, as he stood at the edge of the Flame Garden, he prepared for the first of many trials that would test his worthiness as a champion of light."
                        }]
                    },
                    {
                        "type": "paragraph",
                        "content": [{
                            "type": "text",
                            "text": "The garden was unlike anything in the mortal world. Flowers of pure light bloomed alongside shadows that seemed to move of their own accord. This was where initiates learned to balance the forces of creation and destruction, light and darkness, truth and deception."
                        }]
                    },
                    {
                        "type": "paragraph",
                        "content": [{
                            "type": "text",
                            "text": "Remember, Zoroaster\'s voice echoed in his mind, the greatest victory is not in destroying the darkness, but in understanding it. Only by knowing both light and shadow can one truly serve Ahura Mazda\'s will."
                        }]
                    }
                ]
            }',
            'Three days had passed since Darius first spoke with Zoroaster about his divine vision. Now, as he stood at the edge of the Flame Garden, he prepared for the first of many trials that would test his worthiness as a champion of light. The garden was unlike anything in the mortal world. Flowers of pure light bloomed alongside shadows that seemed to move of their own accord. This was where initiates learned to balance the forces of creation and destruction, light and darkness, truth and deception. Remember, Zoroaster\'s voice echoed in his mind, the greatest victory is not in destroying the darkness, but in understanding it. Only by knowing both light and shadow can one truly serve Ahura Mazda\'s will.',
            'published',
            NOW(),
            '{"tags": ["trial", "flame_garden", "balance"], "estimated_read_time": 3}'
        )
        ON CONFLICT (issue_id, chapter_number) DO NOTHING;
        
        RAISE NOTICE 'Sample chapters created successfully!';
        RAISE NOTICE 'You can now test the chapter reader at:';
        RAISE NOTICE '  /read/zoroaster-chronicles-book-1/the-dream-of-fire';
        RAISE NOTICE '  /read/zoroaster-chronicles-book-1/the-sacred-fire';
        RAISE NOTICE '  /read/zoroaster-chronicles-book-1/the-first-trial';
    ELSE
        RAISE NOTICE 'Chapters table not found or already has data.';
    END IF;
END $$;