FROM public.ecr.aws/lambda/nodejs:20

COPY package*.json ./
RUN npm install --only=production
COPY . .

CMD [ "api.handler" ]
