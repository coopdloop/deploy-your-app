FROM public.ecr.aws/lambda/nodejs:20

COPY index.js ${LAMBDA_TASK_ROOT}

WORKDIR ${LAMBDA_TASK_ROOT}

COPY package*.json ./

RUN npm install --omit=dev

CMD ["index.handler"]
