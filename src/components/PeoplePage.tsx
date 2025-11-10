import { Loader } from './Loader';
import { useEffect, useState } from 'react';
import { getPeople } from '../api';
import { Person } from '../types';
import classNames from 'classnames';
import { PersonLink } from './PersonLink';
import { useParams } from 'react-router-dom';

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { slug } = useParams<{ slug?: string }>();

  const getPersonDataForLink = (
    name: string | null,
    allPeople: Person[],
  ): Person | null => {
    if (!name) {
      return null;
    }

    const foundPerson = allPeople.find(p => p.name === name);

    return foundPerson || null;
  };

  useEffect(() => {
    setIsError(false);
    setIsLoading(true);
    getPeople()
      .then(setPeople)
      .catch(() => {
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const isNoPeople = people.length < 1;

  return (
    <div className="block">
      <h1 className="title">People Page</h1>
      <div className="box table-container">
        {isLoading && <Loader />}
        {isError && (
          <p data-cy="peopleLoadingError" className="has-text-danger">
            Something went wrong
          </p>
        )}
        {!isLoading && !isError && isNoPeople && (
          <p data-cy="noPeopleMessage">There are no people on the server</p>
        )}
        {!isLoading && !isError && people.length > 0 && (
          <table
            data-cy="peopleTable"
            className="table is-striped is-hoverable is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Sex</th>
                <th>Born</th>
                <th>Died</th>
                <th>Mother</th>
                <th>Father</th>
              </tr>
            </thead>

            <tbody>
              {people.map(person => {
                const isFemale = person.sex === 'f';
                const mother = getPersonDataForLink(person.motherName, people);
                const father = getPersonDataForLink(person.fatherName, people);
                const isSelected = person.slug === slug;

                return (
                  <tr
                    data-cy="person"
                    key={person.name}
                    className={classNames({
                      'has-background-warning': isSelected,
                    })}
                  >
                    <td>
                      <PersonLink
                        person={person}
                        className={classNames({
                          'has-text-danger': isFemale,
                        })}
                      />
                    </td>
                    <td>{person.sex}</td>
                    <td>{person.born}</td>
                    <td>{person.died}</td>
                    <td>
                      {mother ? (
                        <PersonLink
                          person={mother}
                          className="has-text-danger"
                        />
                      ) : (
                        person.motherName || '-'
                      )}
                    </td>
                    <td>
                      {father ? (
                        <PersonLink person={father} />
                      ) : (
                        person.fatherName || '-'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
