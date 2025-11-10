import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Person } from '../types';

interface PersonLinkProps {
  person: Person;
  className?: string;
  onSelect: (selectedPerson: Person) => void;
}

export const PersonLink: React.FC<PersonLinkProps> = ({
  person,
  className,
  onSelect,
}) => {
  const navigate = useNavigate();
  const toPath = `/people/${person.slug}`;

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate(toPath, { replace: true });

    if (onSelect) {
      onSelect(person);
    }
  };

  return (
    <NavLink to={toPath} className={className} onClick={handleClick}>
      {person.name}
    </NavLink>
  );
};
