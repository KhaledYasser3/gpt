import asyncio, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

async def check():
    engine = create_async_engine('postgresql+asyncpg://postgres:postgres_secure_pass_123@127.0.0.1:5435/aichatsaas')
    async with engine.connect() as conn:
        r = await conn.execute(text('SELECT id, title, summary FROM chats LIMIT 5'))
        rows = r.fetchall()
        print('=== Chats ===')
        for row in rows:
            print(f"  id={row[0]}, title={repr(row[1])}, summary={repr(row[2])}")

        r2 = await conn.execute(text('SELECT count(*) FROM messages'))
        print(f'\n=== Messages count: {r2.fetchone()[0]} ===')

        r3 = await conn.execute(text('SELECT id, username, interests_summary FROM users LIMIT 3'))
        print('\n=== Users ===')
        for row in r3.fetchall():
            print(f"  id={row[0]}, username={repr(row[1])}, interests={repr(row[2])}")
        
        # Check latest messages
        r4 = await conn.execute(text('SELECT chat_id, role, substring(content,1,80) FROM messages ORDER BY created_at DESC LIMIT 5'))
        print('\n=== Latest 5 Messages ===')
        for row in r4.fetchall():
            print(f"  chat={row[0]}, role={row[1]}, content={repr(row[2])}")
    await engine.dispose()

asyncio.run(check())
