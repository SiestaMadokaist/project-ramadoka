# Joy

An extension of @hapi/joi
By using typescript typing system, it should be possible to create an Joi validation runtime system that match with the interface.

for example it is highly unlikely that given an interface that looks like:
```typescript
interface MyInterface {
  NUM: number;
  STR: string;
}
```

you want a joi that looks like:
```javascript
const mySchema = Joi.object().keys({
  NUM: Joi.string(), // should be Joi.number()
  STR: Joi.number(), // should be Joi.string()
}).optional();
```

with `Joy` you'll be forced to put the correct schema based on the interface like the following:
```typescript
const mySchema: Joy.SchemaOf<MyInterface> = Joy.object<MyInterface>().keys({
  NUM: Joy.number().required(),
  STR: Joy.string().required()
}).required(),
```