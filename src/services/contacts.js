import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../units/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find();

  if (typeof filter.isFavourite === 'boolean') {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.name) {
    contactsQuery.where('name').regex(new RegExp(filter.name, 'i'));
  }

  if (filter.email) {
    contactsQuery.where('email').equals(filter.email);
  }

  if (filter.phone) {
    contactsQuery.where('phoneNumber').regex(new RegExp(filter.phone, 'i'));
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const createContact = async (paylod) => {
  const contact = await ContactsCollection.create(paylod);
  return contact;
};

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
  });
  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const contact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    { new: true, ...options },
  );

  if (!contact) return null;

  return {
    contact,
    isNew: Boolean(options.upsert),
  };
};

// export const getAllContacts = async () => {
//   const contacts = await ContactsCollection.find();
//   return contacts;
// };

// export const getAllStudents = async ({ page, perPage }) => {
//   const limit = perPage;
//   const skip = (page - 1) * perPage;

//   const studentsQuery = StudentsCollection.find();
//   const studentsCount = await StudentsCollection.find()
//     .merge(studentsQuery)
//     .countDocuments();

//   const students = await studentsQuery.skip(skip).limit(limit).exec();

//   const paginationData = calculatePaginationData(studentsCount, perPage, page);

//   return {
//     data: students,
//     ...paginationData,
//   };
// };
