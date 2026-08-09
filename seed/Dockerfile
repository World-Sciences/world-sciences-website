FROM mongo:8
RUN apt-get update \
    && apt-get install -y mongodb-database-tools \
    && rm -rf /var/lib/apt/lists/*
COPY import.sh /import.sh
RUN chmod +x /import.sh
ENTRYPOINT ["/import.sh"]
